import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/core/core.index';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  baseUrl = 'http://localhost:1337'
  ItemTotalPrice = 0
  isLoggedIn$!: Observable<boolean>;
  cartItems: any[] = [];
  checkAuth = ''

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {
    this.cartItems = cartService.getCartItems()
    this.ItemTotalPrice = cartService.getTotalPrice(this.cartItems)
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.isLoggedIn$.subscribe({
      next: (res) => this.checkAuth = res ? '/checkout' : '/login'
    })
  }


  removeFromCart(productId: number) {
    this.cartService.removeItemFromCart(productId)
    this.ItemTotalPrice = this.cartService.getTotalPrice(this.cartItems)
  }
  get totalPrice() {
    return this.ItemTotalPrice
  }
  changeSubtotal(item: any, index: any) {
    this.cartService.saveCart();
    this.ItemTotalPrice = this.cartService.getTotalPrice(this.cartItems)
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
