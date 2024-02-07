import { Injectable } from '@angular/core';



@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private cartKey = 'addToCart';

    // Get cart items from localStorage
    getCartItems(): any[] {
        const cartItems = localStorage.getItem(this.cartKey);
        return cartItems ? JSON.parse(cartItems) : [];
    }

    // Add item to cart
    addItemToCart(item: any): void {
        let cartItems = this.getCartItems();
        cartItems.push(item);
        localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
    }

    // Remove item from cart
    removeItemFromCart(index: number): void {
        let cartItems = this.getCartItems();
        if (index > -1 && index < cartItems.length) {
            cartItems.splice(index, 1);
            localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
        }
    }

    // Clear cart
    clearCart(): void {
        localStorage.removeItem(this.cartKey);
    }
}
