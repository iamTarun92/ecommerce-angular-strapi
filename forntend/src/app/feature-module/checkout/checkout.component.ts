import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, CartService, CouponService } from 'src/app/core/core.index';
import { ProductData } from 'src/app/core/models/product';
import { AuthService } from 'src/app/core/services/auth/auth.service';

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
  selectedPaymentMethod = null;
  isDelivery = false
  ItemTotalPrice = 0
  subTotal = 0
  couponCode: any;
  couponId: any;
  couponDiscount = 0;
  isCouponValid: boolean | null = null;
  isMinOrder: boolean | null = null;


  constructor(private fb: FormBuilder, private authService: AuthService, private cartService: CartService, private router: Router, private apiService: ApiService, private couponService: CouponService) { }

  ngOnInit(): void {
    if (!this.cartService.getCartItems()) {
      this.router.navigate([''])
    }
    this.cartItems = this.cartService.getCartItems()
    this.subTotal = this.cartService.getSubTotal(this.cartItems)
    this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
    if (localStorage.getItem('coupon')) {
      this.couponCode = localStorage.getItem('coupon')
      this.applyCoupon(this.couponCode)
    }

    this.currentUser = JSON.parse(this.authService.getUser() || '')
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

  get totalPrice() {
    return this.ItemTotalPrice
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
    return this.billingAddressForm.valid && this.selectedPaymentMethod
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
        "amount": this.cartService.getSubTotal(this.cartItems).toString(),
        "couponId": this.couponId.toString()
      }
    }
    this.apiService.addOrder(data).subscribe({
      next: (response) => {
        alert('Your order is placed.')
        localStorage.removeItem('cartItems')
        localStorage.removeItem('coupon')
        this.cartService.loadCart()
        this.router.navigate(['orders'])
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

  applyCoupon(code: string) {
    this.couponService.fetchCouponByCode(code).subscribe({
      next: (response) => {
        if (response) {
          const startDate = response.attributes.startDate
          const endDate = response.attributes.endDate
          const isFixedPrice = response.attributes.isfixed
          const minOrder = response.attributes.minOrder
          this.isCouponValid = this.couponService.isCouponValid(startDate, endDate)
          this.couponId = response.id
          if (minOrder <= this.ItemTotalPrice) {
            if (this.isCouponValid) {
              this.couponDiscount = response.attributes.discount
              localStorage.setItem('coupon', this.couponCode)
            } else {
              localStorage.removeItem('coupon')
              this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
            }
            if (isFixedPrice) {
              this.ItemTotalPrice = this.ItemTotalPrice - this.couponDiscount
            } else {
              this.ItemTotalPrice = this.calculateDiscountedPrice(this.ItemTotalPrice, this.couponDiscount)
            }
          } else {
            this.isMinOrder = true
          }
        }
        else {
          // this.couponCode = ''
          this.isCouponValid = false
          localStorage.removeItem('coupon')
          this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
        }
      }
    })
  }

}
