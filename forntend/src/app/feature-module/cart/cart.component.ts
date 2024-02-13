import { Component } from '@angular/core';
import { CartService } from 'src/app/core/core.index';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  baseUrl = 'http://localhost:1337'
  ItemTotalPrice = 0
  shipingPrice = 50

  cartItems: any[] = [];
  constructor(private cartService: CartService) {
    this.cartItems = cartService.getCartItems()
    this.ItemTotalPrice = cartService.getTotalPrice(this.cartItems)
  }

  removeFromCart(productId: number) {
    this.cartService.removeItemFromCart(productId)
    this.ItemTotalPrice = this.cartService.getTotalPrice(this.cartItems)
  }
  get totalPrice() {
    return this.shipingPrice + this.ItemTotalPrice
  }
  changeSubtotal(item: any, index: any) {
    this.cartService.saveCart();
    this.ItemTotalPrice = this.cartService.getTotalPrice(this.cartItems)
  }
}
