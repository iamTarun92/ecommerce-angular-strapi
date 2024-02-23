import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/core.index';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  currentUser: any
  allOrder: any
  constructor(private activeRoute: ActivatedRoute, private apiService: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getUser() || '')

    this.activeRoute.queryParams.subscribe(data => {
      this.apiService.fetchOrderById(data?.['order_id']).subscribe({
        next: (res) => {
          this.allOrder = res?.data
        }
      })
    })


  }
  getTotalPrice(): number {
    return this.allOrder.reduce((sum: any, product: any) => {
      return sum + product.attributes.products.reduce((subSum: any, subProduct: any) => {
        return subSum + (parseInt(!!subProduct.attributes.specialPrice ? subProduct.attributes.specialPrice : subProduct.attributes.price) * subProduct.quantity);
      }, 0);
    }, 0);
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
}
