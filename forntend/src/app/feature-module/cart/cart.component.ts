import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService, CartService } from 'src/app/core/core.index';
import { ProductData } from 'src/app/core/models/product';
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
  isCouponValid: boolean | null = null;


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
    const couponCode = code.toUpperCase()
    this.apiService.fetchCouponByCode(couponCode).subscribe({
      next: (response) => {
        this.isCouponValid = !!response.data.length
        if (this.isCouponValid) {
          localStorage.setItem('coupon', this.couponCode)
          this.couponDiscount = response.data[0]?.attributes.discount
          this.ItemTotalPrice = this.calculateDiscountedPrice(this.ItemTotalPrice, this.couponDiscount)
        } else {
          // this.couponCode = null
          localStorage.removeItem('coupon')
          this.ItemTotalPrice = this.cartService.getTotalPrice(this.cartItems)
        }
      }
    })
  }
}