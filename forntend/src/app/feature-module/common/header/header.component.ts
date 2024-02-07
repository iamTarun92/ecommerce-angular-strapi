import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartItems:any;
  constructor() {
    this.cartItems = this.getCartItems()
  }
  getCartItems(): any[] {
    const cartItems = localStorage.getItem('addToCart');
    return cartItems ? JSON.parse(cartItems) : [];
}
}
