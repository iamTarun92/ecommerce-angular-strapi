import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService, CartService, CouponService } from 'src/app/core/core.index';
import { CouponData } from 'src/app/core/models/coupon-codes';
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
  subTotal = 0
  isLoggedIn$!: Observable<boolean>;
  cartItems: any[] = [];
  checkAuth = ''
  couponData: any
  couponCode: any;
  couponDiscount = 0;
  isCouponValid: boolean | null = null;
  isMinOrder: boolean | null = null;


  constructor(private cartService: CartService, private apiService: ApiService, private couponService: CouponService, private authService: AuthService, private router: Router) {

  }

  ngOnInit() {

    this.cartItems = this.cartService.getCartItems()
    this.subTotal = this.cartService.getSubTotal(this.cartItems)
    this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
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
    this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
  }

  changeSubtotal(item: any, index: any) {
    this.cartService.saveCart();
    this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
    this.subTotal = this.cartService.getSubTotal(this.cartItems)
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
    const couponCode = code
    this.couponService.fetchCouponByCode(couponCode).subscribe({
      next: (response) => {
        if (response) {
          const startDate = response.attributes.startDate
          const endDate = response.attributes.endDate
          const isfixed = response.attributes.isfixed
          const minOrder = response.attributes.minOrder
          this.isCouponValid = this.couponService.isCouponValid(startDate, endDate)
          this.couponData = response
          if (minOrder <= this.ItemTotalPrice) {
            if (this.isCouponValid) {
              this.couponDiscount = response.attributes.discount
              localStorage.setItem('coupon', this.couponCode)
            } else {
              localStorage.removeItem('coupon')
              this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
            }
            if (!isfixed) {
              this.ItemTotalPrice = this.calculateDiscountedPrice(this.ItemTotalPrice, this.couponDiscount)
            } else if (isfixed) {
              this.ItemTotalPrice = this.ItemTotalPrice - this.couponDiscount
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