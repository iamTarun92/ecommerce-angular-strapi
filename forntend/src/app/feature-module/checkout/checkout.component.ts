import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, CartService } from 'src/app/core/core.index';
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
  paymentOptions = ['Cash on delivery'];
  selectedPaymentOption = ''
  isDelivery = false

  constructor(private fb: FormBuilder, private authService: AuthService, private cartService: CartService, private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems()
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

  copyBillingAddressToDelivery(event: any) {
    if (event.target.checked) {
      this.deliveryAddressForm.patchValue(this.billingAddressForm.value);
    } else {
      this.deliveryAddressForm.reset();
    }
  }

  get isCheckedAddressForm() {
    return this.billingAddressForm.valid && this.deliveryAddressForm.valid && this.selectedPaymentOption
  }

  isOrderConfirm() {
    const orderId = Math.floor(Math.random() * 1000)
    const transactionId = Math.floor(Math.random() * 1000)
    const address = {
      billing: this.billingAddressForm.value,
      deliver: this.deliveryAddressForm.value,
    }
    const data = {
      "data": {
        "email": this.currentUser.email,
        "orderId": orderId.toString(),
        "paymentInfo": "",
        "products": this.cartItems,
        "address": address,
        "name": this.billingAddressForm.value.fullName,
        "transactionId": transactionId.toString(),
        "amount": this.cartService.getTotalPrice(this.cartItems).toString(),
      }
    }
    this.apiService.addOrder(data).subscribe({
      next: (response) => {
        alert('Your order is placed.')
        localStorage.removeItem('cartItems')
        this.cartService.loadCart()
        this.router.navigate(['cart'])
      },
      error: (error) => alert('Error: ' + error.error.error.message)

    })
  }

}
