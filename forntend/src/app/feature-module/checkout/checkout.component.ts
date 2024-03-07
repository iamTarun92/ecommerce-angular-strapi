import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, CartService, CouponService } from 'src/app/core/core.index';
import { CouponData } from 'src/app/core/models/coupon-codes';
import { ProductData } from 'src/app/core/models/product';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import emailjs from '@emailjs/browser';
import { AddressAttributes, AddressData } from 'src/app/core/models/address';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  baseUrl = 'http://localhost:1337'
  billingAddressForm!: FormGroup
  deliveryAddressForm!: FormGroup

  cartItems: any[] = [];
  currentUser: any
  paymentMethods = [
    { id: 1, name: 'Cash on delivery', value: 'COD' },
  ];
  selectedPaymentMethod: string | null = null;
  isDelivery = false
  ItemTotalPrice = 0
  subTotal = 0
  couponCode: any;
  couponId: any;
  couponDiscount = 0;
  isCouponValid: boolean | null = null;
  isMinOrder: boolean | null = null;
  couponData: CouponData | null = null
  duplicateCouponCode: boolean | null = null;
  otpArray = [1, 2, 3, 4, 5];
  randomIndex = Math.floor(Math.random() * this.otpArray.length);
  randomNumber = this.otpArray[this.randomIndex];
  otp: any
  allAddress: AddressData[] = []
  selectedAddress!: any | AddressAttributes;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private apiService: ApiService,
    private couponService: CouponService
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')

    this.loadAddress()
    if (!this.cartService.getCartItems()) {
      this.router.navigate([''])
    }
    this.cartItems = this.cartService.getCartItems()
    this.subTotal = this.cartService.getSubTotal(this.cartItems)
    this.ItemTotalPrice = this.subTotal
    if (localStorage.getItem('couponCode')) {
      this.couponCode = localStorage.getItem('couponCode')
      this.applyCoupon(this.couponCode, false)
    }

    this.billingAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]]
    });
    this.deliveryAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]]
    });

  }

  onSelectPaymentMethod(method: any) {
    this.selectedPaymentMethod = method.value;
  }

  copyBillingAddressToDelivery(event: any) {
    if (event.target.checked) {
      this.isDelivery = true
      this.deliveryAddressForm.patchValue(this.billingAddressForm.value);
    } else {
      this.isDelivery = false
      this.deliveryAddressForm.reset();
    }
  }

  get isCheckedAddressForm() {
    return this.billingAddressForm.valid && this.selectedPaymentMethod && this.otpCheck(+this.otp)
  }

  isOrderConfirm() {
    const orderId = Math.floor(Math.random() * 1000) + '-' + Math.floor(new Date().getTime() / 1000);
    const transactionId = Math.floor(Math.random() * 1000) + '-' + Math.floor(new Date().getTime() / 1000);
    const address = {
      billing: this.billingAddressForm.value,
      deliver: this.deliveryAddressForm.value,
    }
    const data = {
      "data": {
        "email": this.currentUser.email,
        "orderId": orderId.toString(),
        "paymentMethod": this.selectedPaymentMethod,
        "products": this.cartItems,
        "address": address,
        "name": this.billingAddressForm.value.fullName,
        "transactionId": transactionId.toString(),
        "amount": this.ItemTotalPrice,
        "couponId": this.couponId?.toString()
      }
    }
    this.apiService.addOrder(data).subscribe({
      next: (response) => {
        this.router.navigate(['orders'])
        localStorage.removeItem('cartItems')
        localStorage.removeItem('couponCode')
        this.cartService.loadCart()
      },
      error: (error) => alert('Error: ' + error.error.error.message)

    })
  }

  hasFixedPrice(product: ProductData): boolean {
    return this.cartService.hasFixedPrice(product)
  }

  hasSpecialPrice(product: ProductData): boolean {
    return this.cartService.hasSpecialPrice(product)
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    return this.cartService.calculateDiscountedPrice(originalPrice, discountPercentage)
  }

  applyCoupon(code: string, check: boolean): void {
    if (check) {
      if (this.couponCode !== localStorage.getItem('couponCode')) {
        this.loadCouponCode(code)
      } else {
        this.duplicateCouponCode = true
      }
    } else {
      this.loadCouponCode(code)
    }
  }

  loadCouponCode(code: string): void {
    this.couponService.fetchCouponByCode(code).subscribe({
      next: (response) => {
        if (response) {
          const startDate = response.attributes.startDate
          const endDate = response.attributes.endDate
          const isFixedPrice = response.attributes.isfixed
          const minOrder = response.attributes.minOrder
          this.isCouponValid = this.couponService.isCouponValid(startDate, endDate)
          this.couponData = response
          if (minOrder <= this.subTotal) {
            if (this.isCouponValid) {
              this.couponDiscount = response.attributes.discount
              localStorage.setItem('couponCode', this.couponCode)
              if (isFixedPrice) {
                this.ItemTotalPrice = this.ItemTotalPrice - this.couponDiscount
              } else {
                this.ItemTotalPrice = this.calculateDiscountedPrice(this.ItemTotalPrice, this.couponDiscount)
              }
            } else {
              localStorage.removeItem('couponCode')
              this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
            }
          } else {
            this.isMinOrder = true
          }
        }
        else {
          this.couponData = null

          this.isCouponValid = false
          localStorage.removeItem('couponCode')
          this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
        }
      }
    })
  }
  loadAddress() {
    this.apiService.fetchAddressByEmail(this.currentUser.email).subscribe({
      next: res => {
        this.allAddress = res.data
        this.selectedAddress = this.allAddress?.find((address) => !!address.attributes.primary)?.attributes
      }
    })
  }

  sendOtp(user: any) {
    emailjs.init("_u6qKPa9-76niq83g")
    emailjs.send("service_tjvnsxq", "template_7uud2sl", {
      from_name: "tarunpandey@promantus.com",
      to_name: this.currentUser.username,
      message: this.otpArray[this.randomNumber],
      to: this.currentUser.email,
    });

    alert('OTP send to your email.')
  }

  otpCheck(num: number) {
    return this.otpArray.includes(num)
  }

  onAddressSelected(address: any) {
    this.selectedAddress = address;
  }
}
