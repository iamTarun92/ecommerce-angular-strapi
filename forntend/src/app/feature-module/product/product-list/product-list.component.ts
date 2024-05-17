import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, CartService, WishlistService } from 'src/app/core/core.index';
import { ProductData } from 'src/app/core/models/product';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: ProductData[] = []
  baseUrl = 'http://localhost:1337'
  currentUser: any
  wishListItems: any


  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private wishListService: WishlistService,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')

    this.activeRoute.params.subscribe(data => {
      const categoryId = this.activeRoute.snapshot.params['categoryId']
      this.apiService.fetchProductByCategoryId(categoryId).subscribe({
        next: (res: any) => {
          this.products = res?.data
          if (this.currentUser) {
            this.loadWishListItems()
          }
        },
        error: (err) => {
          alert('404 Error.')
        },
      });
    })
  }

  isItemExists(product: any): boolean {
    return this.wishListItems?.findIndex((o: any) => parseInt(o.attributes.productId) === product.id) > -1;
  }
  loadWishListItems() {
    this.wishListService.getWishlistItems().subscribe({
      next: (response) => {
        this.wishListService.wishListCount.next(response.data.length)
        this.wishListItems = response.data.filter((item: any) => item.attributes.email === this.currentUser.email)
      }
    })
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

  handleAddToWishList(userEmail: string, productId: string) {
    const data = {
      "email": userEmail,
      "productId": productId

    }
    if (this.authService.getToken()) {
      this.wishListService.addToWishlist(data).subscribe({
        next: (res) => {
          alert('Product added.')
          this.loadWishListItems()
        },
        error: (error) => {
          alert('error')
        }
      })
    } else {
      this.router.navigate(['/login']);
    }
  }
  handleRemoveWishList(productId: number) {
    alert('This product is already added.')
  }
}
