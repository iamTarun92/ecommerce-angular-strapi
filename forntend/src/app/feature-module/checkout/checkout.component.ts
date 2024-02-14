import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/core.index';
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

  constructor(private fb: FormBuilder, private authService: AuthService, private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems()
    this.currentUser = JSON.parse(this.authService.getUser() || '')
    this.billingAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]]
    });
    this.deliveryAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
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
    alert('Your order is placed.')
    localStorage.removeItem('cartItems')
    this.cartService.loadCart()
    this.router.navigate(['cart'])
  }

}
