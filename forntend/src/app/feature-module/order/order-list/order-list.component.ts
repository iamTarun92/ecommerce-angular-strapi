import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, CartService, CouponService } from 'src/app/core/core.index';
import { CouponData } from 'src/app/core/models/coupon-codes';
import { ProductData } from 'src/app/core/models/product';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  currentUser: any
  allOrder: any
  couponData: CouponData | null = null
  subTotal = 0


  constructor(private activeRoute: ActivatedRoute, private apiService: ApiService, private authService: AuthService, private cartService: CartService, private couponService: CouponService) { }

  ngOnInit(): void {

    this.currentUser = JSON.parse(this.authService.getUser() || '{}')

    this.activeRoute.queryParams.subscribe(data => {
      this.apiService.fetchOrderById(data?.['order_id']).subscribe({
        next: (res) => {
          this.allOrder = res?.data
          this.subTotal = this.cartService.getSubTotal(this.allOrder[0].attributes.products)
        }
      })
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
}
