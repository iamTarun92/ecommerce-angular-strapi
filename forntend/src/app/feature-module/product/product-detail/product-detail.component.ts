import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, WishlistService } from 'src/app/core/core.index';
import { ProductData } from 'src/app/core/models/product';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ApiService } from 'src/app/core/services/common/api.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  id: any;
  isLoggedIn$!: Observable<boolean>;
  product: any;
  quantity = 1
  currentUser: any
  wishListItems: any
  selectedRating = 1
  description = ''

  constructor(
    private apiService: ApiService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private wishListService: WishlistService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')

    this.activeRoute.params.subscribe(data => {
      const id = this.activeRoute.snapshot.params['id']
      this.apiService.fetchProductById(id).subscribe({
        next: (res: any) => {
          this.product = res.data
          if (this.cartService.getCartItems()) {
            this.updateItemQty(this.cartService.getCartItems(), this.product)
          }
          if (this.currentUser) {
            this.loadWishListItems()
          }
        },
        error: () => {
          // this.router.navigate([''])
        }
      });
    })
  }

  get isFormValid(): boolean {
    return this.selectedRating > 0 && this.description !== ''
  }

  selectedCartItem(id: number) {
    let localCartString = localStorage.getItem('cartItems');
    if (!localCartString) return false;
    let localCart = JSON.parse(localCartString);
    return localCart.find((obj: any) => obj.id === id);
  }

  isItemExists(product: any): boolean {
    return this.cartService.itemInCart(product)
  }
  updateItemQty(arr: any, item: any): void {
    const existingItem = arr.find((cartItem: any) => cartItem.id === item.id);
    if (existingItem) {
      this.quantity = existingItem.quantity;
    }

  }
  isItemExistsInWishlist(product: any): boolean {
    return this.wishListItems?.findIndex((o: any) => parseInt(o.attributes.productId) === product.id) > -1;
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

  addToCart(product: any) {
    product.quantity = this.quantity
    this.cartService.addItemToCart(product)
  }

  removeFromCart(productId: number) {
    this.cartService.removeItemFromCart(productId)
  }

  handleAddToWishList(userEmail: string, productId: string) {
    if (this.authService.getToken()) {
      const data = {
        "email": userEmail,
        "productId": productId

      }
      this.wishListService.addToWishlist(data).subscribe({
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
  }
  loadWishListItems() {
    this.wishListService.getWishlistItems().subscribe({
      next: (response) => {
        this.wishListService.wishListCount.next(response.data.length)

        this.wishListItems = response.data.filter((item: any) => item.attributes.email === this.currentUser.email)
      }
    })
  }
  submitReview(reviewDescription: any) {
    const data = {
      "data": {
        "content": reviewDescription.value,
        "note": this.selectedRating,
        "product": this.product,
        "author": this.currentUser
      }
    }
    this.apiService.addReview(data).subscribe({
      next: (res) => {
        alert('Review added successfully.')
        const closeBtn = this.closeBtn.nativeElement as HTMLElement
        closeBtn.click()
        this.selectedRating = 0
        this.description = ''
      }
    })
  }

  onRatingChanged(rating: number) {
    this.selectedRating = rating;
  }
}
