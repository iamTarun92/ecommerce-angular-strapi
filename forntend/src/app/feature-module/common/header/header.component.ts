import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/core/core.index';
import { AuthService } from 'src/app/core/helper/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData: any;
  isLoggedIn$!: Observable<boolean>;

  constructor(private cartService: CartService, private authService: AuthService) {
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
  }
  logOut(){
    this.authService.logout()
  }
}
