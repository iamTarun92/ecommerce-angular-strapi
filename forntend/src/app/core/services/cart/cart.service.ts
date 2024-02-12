import { EventEmitter, Injectable } from '@angular/core';



@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartKey = 'addToCart';
    cartData = new EventEmitter<any>()

    // Get cart items from localStorage
    getCartItems(): any[] {
        const cartItems = localStorage.getItem(this.cartKey);
        return cartItems ? JSON.parse(cartItems) : [];
    }

    // Add item to cart
    addItemToCart(product: any): void {
        let cartItems = this.getCartItems();
        cartItems.push(product);
        localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
        this.cartData.emit(cartItems)
    }

    // Remove item from cart
    removeItemFromCart(productId: number): void {
        let cartItems = this.getCartItems();
        cartItems = cartItems.filter((item) => item.id !== productId);
        if (cartItems.length) {
            localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
        } else {
            this.clearCart(this.cartKey)
        }
        this.cartData.emit(cartItems)

    }

    // Clear cart
    clearCart(key: string): void {
        localStorage.removeItem(key);
    }
}
