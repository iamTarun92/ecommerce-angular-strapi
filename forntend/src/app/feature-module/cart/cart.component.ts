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
  couponData!: CouponData
  couponCode: any;
  couponDiscount = 0;
  isCouponValid: boolean | null = null;
  isMinOrder: boolean | null = null;


  constructor(private cartService: CartService, private apiService: ApiService, private couponService: CouponService, private authService: AuthService, private router: Router) {

  }

  ngOnInit() {

    this.cartItems = this.cartService.getCartItems()
    this.subTotal = this.cartService.getSubTotal(this.cartItems)
    this.ItemTotalPrice = this.subTotal
    this.isLoggedIn$ = this.authService.isLoggedIn();

    this.isLoggedIn$.subscribe({
      next: (res) => this.checkAuth = res ? '/checkout' : '/login'
    })

    if (localStorage.getItem('couponCode')) {
      this.couponCode = localStorage.getItem('couponCode')
      this.applyCoupon(this.couponCode)
    }
  }

  removeFromCart(productId: number) {
    this.cartService.removeItemFromCart(productId)
    this.changeSubtotal()
    if (!this.cartItems.length) {
      localStorage.removeItem('couponCode')
    }
  }

  changeSubtotal() {
    this.cartService.saveCart();
    this.subTotal = this.cartService.getSubTotal(this.cartItems)
    if (this.couponData?.attributes.isfixed) {
      this.ItemTotalPrice = this.subTotal - this.couponData.attributes.discount
    } else {
      this.ItemTotalPrice = this.calculateDiscountedPrice(this.subTotal, this.couponDiscount)
    }
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
          this.couponData = response
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
        }
        else {
          // this.couponCode = ''
          this.isCouponValid = false
          localStorage.removeItem('couponCode')
          this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
        }
      }
    })
  }
}