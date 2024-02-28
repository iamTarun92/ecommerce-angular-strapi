import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/core.index';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  currentUser: any
  allOrder: any

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getUser() || '{}')

    this.apiService.fetchOrderByEmail(this.currentUser.email).subscribe({
      next: (res) => {
        this.allOrder = res.data
      }
    })
  }

}
