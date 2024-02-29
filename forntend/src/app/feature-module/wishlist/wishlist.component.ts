import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, CartService, WishlistService } from 'src/app/core/core.index';
import { ProductData } from 'src/app/core/models/product';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  wishListItems: any[] = []
  products: any[] = []
  productIds: any[] = []
  currentUser: any

  constructor(
    private wishListService: WishlistService,
    private authService: AuthService,
    private apiService: ApiService,
    private cartService: CartService,
    private router: Router
  ) {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')
  }

  ngOnInit(): void {
    // if (!this.allProducts.length) {
    //   this.router.navigate([''])
    // }
    this.loadProduct()
    this.loadWishListItems()
  }

  loadProduct() {
    this.apiService.fetchProducts().subscribe({
      next: (response) => {
        this.products = response.data
      }
    })
  }
  loadWishListItems() {
    this.wishListService.getWishlistItems().subscribe({
      next: (response) => {
        this.wishListService.wishListCount.next(response.data.length)
        this.wishListItems = response.data.filter((item: any) => item.attributes.email === this.currentUser.email)
      }
    })
  }

  get allProducts(): ProductData[] {
    return this.products.filter(item1 =>
      this.wishListItems.some(item2 => item1.id === parseInt(item2.attributes.productId))
    )
  }

  hasFixedPrice(product: ProductData): boolean {
    return this.cartService.hasFixedPrice(product)
  }

  hasSpecialPrice(product: ProductData): boolean {
    return this.cartService.hasSpecialPrice(product)
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    return this.cartService.calculateDiscountedPrice(originalPrice, discountPercentage)
  }
  handleRemoveWishList(productId: number) {
    const arr = this.wishListItems.find((product: any) => parseInt(product.attributes.productId) === productId);

    this.wishListService.removeFromWishlist(arr.id).subscribe({
      next: (res) => {
        this.loadWishListItems()
        alert('Product deleted.')
      },
      error: (error) => {
        alert('error')
      }
    })
  }
}
