import { Component } from '@angular/core';
import { CartService } from 'src/app/core/core.index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartData: any;
  constructor(private prdService: CartService) {
    this.cartData = this.getCartItems()

    prdService.cartData.subscribe({
      next: (res: any) => {
        this.cartData = res
      }
    })

  }
  getCartItems(): any[] {
    const cartItems = localStorage.getItem('addToCart');
    return cartItems ? JSON.parse(cartItems) : [];
  }
}
