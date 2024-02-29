import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, WishlistService } from 'src/app/core/core.index';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData: any;
  wishListCount!: number
  isLoggedIn$!: Observable<boolean>;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private wishListService: WishlistService,
    private router: Router
  ) {
    cartService.loadCart()
    this.cartData = cartService.getCartItems()
    cartService.cartData.subscribe({
      next: (res: any) => {
        this.cartData = res
      }
    })
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.wishListService.wishListCount.subscribe((res) => this.wishListCount = res)
    this.wishListService.getWishlistItems().subscribe({
      next: (res) => {
        this.wishListService.wishListCount.next(res.data.length)
      }
    })
  }

  logOut() {
    this.authService.logout()
    this.router.navigate(['category'])
  }
}
