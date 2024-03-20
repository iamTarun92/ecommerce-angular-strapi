import { EventEmitter, Injectable } from '@angular/core';
import { ProductData } from '../../models/product';



@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartKey = 'cartItems';
    cartItems: any[] = []
    cartData = new EventEmitter<any>()

    constructor() { }

    getCartItems() {
        return this.cartItems
    }

    loadCart(): void {
        const cartItems = localStorage.getItem(this.cartKey);
        this.cartItems = cartItems ? JSON.parse(cartItems) : [];
        this.cartData.emit(this.cartItems)
    }

    addItemToCart(product: any): void {
        const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem.id === product.id);
        if (existingItemIndex !== -1) {
            alert("Product updated.")
            this.cartItems[existingItemIndex].attributes.quantity = product.attributes.quantity;
            this.cartItems[existingItemIndex].attributes.stock = product.attributes.stock;
            if (this.cartItems[existingItemIndex].attributes.selectedAttributes) {
                this.cartItems[existingItemIndex].attributes.selectedAttributes = product.attributes.selectedAttributes;
            }
        } else {
            alert("Product added.")
            this.cartItems.push(product);
        }
        this.saveCart()
    }

    removeItemFromCart(productId: number) {
        const existingItemIndex = this.cartItems.findIndex(o => o.id === productId);
        if (existingItemIndex > -1) {
            this.cartItems.splice(existingItemIndex, 1);
            this.saveCart()
        }

    }

    saveCart(): void {
        localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
        this.cartData.emit(this.cartItems)
        if (!this.cartItems.length) {
            this.clearCart(this.cartKey)
        }
    }

    clearCart(key: string): void {
        this.cartItems = []
        localStorage.removeItem(key);
    }

    itemInCart(item: any): boolean {
        return this.cartItems.findIndex(o => o.id === item.id) > -1;
    }

    // Get total price sum
    getSubTotal(cartItems: any): number {
        return cartItems.reduce((total: any, product: any) => total + (parseInt(!!product.attributes.specialPrice && product.attributes.isFixedPrice ? product.attributes.specialPrice : !!product.attributes.specialPrice && !product.attributes.isFixedPrice ? this.calculateDiscountedPrice(product.attributes.price, product.attributes.specialPrice) : product.attributes.price) * product.attributes.quantity), 0);
    }
    getTotalQuantity(arr: any): number {
        return arr.reduce((total: any, product: any) => total + parseInt(product.attributes.quantity), 0);
    }
    hasFixedPrice(product: ProductData): boolean {
        return product.attributes.isFixedPrice
    }
    hasSpecialPrice(product: ProductData): boolean {
        return !!product.attributes.specialPrice
    }
    calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
        return originalPrice - (originalPrice * discountPercentage / 100);
    }
}
