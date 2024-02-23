import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService, CartService } from 'src/app/core/core.index';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  baseUrl = 'http://localhost:1337'
  ItemTotalPrice = 0
  isLoggedIn$!: Observable<boolean>;
  cartItems: any[] = [];
  checkAuth = ''
  couponCode: any;
  couponDiscount = 0;
  isCodeValid = false


  constructor(private cartService: CartService, private apiService: ApiService, private authService: AuthService, private router: Router) {

  }

  ngOnInit() {

    this.cartItems = this.cartService.getCartItems()
    this.ItemTotalPrice = this.cartService.getTotalPrice(this.cartItems)
    this.isLoggedIn$ = this.authService.isLoggedIn();

    this.isLoggedIn$.subscribe({
      next: (res) => this.checkAuth = res ? '/checkout' : '/login'
    })

    if (localStorage.getItem('coupon')) {
      this.couponCode = localStorage.getItem('coupon')
      this.applyCoupon(this.couponCode)
    }
  }

  get totalPrice() {
    return this.ItemTotalPrice
  }

  removeFromCart(productId: number) {
    this.cartService.removeItemFromCart(productId)
    this.ItemTotalPrice = this.cartService.getTotalPrice(this.cartItems)
  }

  changeSubtotal(item: any, index: any) {
    this.cartService.saveCart();
    this.ItemTotalPrice = this.cartService.getTotalPrice(this.cartItems)
    this.ItemTotalPrice = this.calculateDiscountedPrice(this.ItemTotalPrice, this.couponDiscount)
  }

  hasFixedPrice(product: any): boolean {
    return product.attributes.isFixedPrice
  }

  hasSpecialPrice(product: any): boolean {
    return !!product.attributes.specialPrice
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    return originalPrice - (originalPrice * discountPercentage / 100);
  }

  applyCoupon(code: string) {
    this.apiService.fetchCouponByCode(code.toUpperCase()).subscribe({
      next: (response) => {
        this.isCodeValid = !!response.data.length
        if (this.isCodeValid) {
          this.couponDiscount = response.data[0]?.attributes.discount
          localStorage.setItem('coupon', this.couponCode)
          this.ItemTotalPrice = this.calculateDiscountedPrice(this.ItemTotalPrice, this.couponDiscount)
        } else {
          this.couponCode = ''
          localStorage.removeItem('coupon')
          this.ItemTotalPrice = this.cartService.getTotalPrice(this.cartItems)
          alert('Coupon Code is not valid.')
        }
      }
    })
  }
}