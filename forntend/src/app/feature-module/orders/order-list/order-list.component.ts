import { Component, OnInit } from '@angular/core';
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
  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getUser() || '')
    this.apiService.getOrderByUserId(this.currentUser.email).subscribe({
      next: (res) => {
        this.allOrder = res?.data        
      }
    })
  }
  getTotalPrice(): number {
    return this.allOrder.reduce((sum: any, product: any) => {
      return sum + product.attributes.products.reduce((subSum: any, subProduct: any) => {
        return subSum + (parseInt(subProduct.attributes.price) * subProduct.quantity);
      }, 0);
    }, 0);
  }
}
