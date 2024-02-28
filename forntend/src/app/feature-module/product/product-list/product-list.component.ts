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
  productIds: any[] = []


  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private wishService: WishlistService,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getUser() || '{}')

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

  addToCart(product: any) {
    product.quantity = 1
    this.cartService.addItemToCart(product)
  }

  removeFromCart(productId: number) {
    this.cartService.removeItemFromCart(productId)
  }

  checkProductExists(id: number): boolean {
    return this.cartService.checkProductExists(id)
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


  loadWishListItems() {
    this.wishService.getWishlistItems().subscribe({
      next: (response) => {
        this.wishListItems = response.data.filter((item: any) => item.attributes.email === this.currentUser.email)
        this.productIds = this.wishListItems.map((item: any) => parseInt(item.attributes.productId));
      }
    })
  }
  handleAddToWishList(userEmail: string, productId: string) {
    if (this.authService.getToken()) {
      const data = {
        "email": userEmail,
        "productId": productId

      }
      this.wishService.addToWishlist(data).subscribe({
        next: (res) => {
          this.loadWishListItems()
          alert('Product added.')
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
    // const arr = this.wishListItems.find((product: any) => parseInt(product.attributes.productId) === productId);

    // this.wishService.removeFromWishlist(arr.id).subscribe({
    //   next: (res) => {
    //     this.loadWishListItems()
    //     alert('Product deleted.')
    //   },
    //   error: (error) => {
    //     alert('error')
    //   }
    // })
  }
}
