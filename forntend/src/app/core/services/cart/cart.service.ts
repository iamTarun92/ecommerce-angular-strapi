import { EventEmitter, Injectable } from '@angular/core';



@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartKey = 'cartItems';
    cartItems: any[] = []
    cartData = new EventEmitter<any>()

    constructor() {
        // this.clearCart(this.cartKey)
    }

    getCartItems() {
        return this.cartItems
    }

    loadCart(): void {
        const cartItems = localStorage.getItem(this.cartKey);
        this.cartItems = cartItems ? JSON.parse(cartItems) : [];
        this.cartData.emit(this.cartItems)
    }

    addItemToCart(product: any): void {
        this.cartItems.push(product);
        this.saveCart()
    }

    removeItemFromCart(productId: number) {
        const index = this.cartItems.findIndex(o => o.id === productId);
        if (index > -1) {
            this.cartItems.splice(index, 1);
            this.saveCart()
        }
    }

    saveCart(): void {
        localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
        this.cartData.emit(this.cartItems)
    }

    clearCart(key: string): void {
        this.cartItems = []
        localStorage.removeItem(key);
    }

    itemInCart(item: any): boolean {
        return this.cartItems.findIndex(o => o.id === item.id) > -1;
    }

    // Get total price sum
    getTotalPrice(arr: any): number {
        return arr.reduce((total: any, product: any) => total + (parseInt(product.attributes.price) * product.quantity), 0);
    }
    getTotalQuantity(arr: any): number {
        return arr.reduce((total: any, product: any) => total + parseInt(product.quantity), 0);
    }
}
