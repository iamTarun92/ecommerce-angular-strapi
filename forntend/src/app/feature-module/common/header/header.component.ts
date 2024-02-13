import { Component } from '@angular/core';
import { CartService } from 'src/app/core/core.index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartData: any;
  constructor(private cartService: CartService) {
    cartService.loadCart()
    this.cartData = cartService.getCartItems()
    cartService.cartData.subscribe({
      next: (res: any) => {
        this.cartData = res
      }
    })

  }
}
