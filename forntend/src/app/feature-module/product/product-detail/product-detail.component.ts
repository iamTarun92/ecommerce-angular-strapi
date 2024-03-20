import { Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, WishlistService } from 'src/app/core/core.index';
import { ProductData } from 'src/app/core/models/product';
import { ReviewData } from 'src/app/core/models/review';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ApiService } from 'src/app/core/services/common/api.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  id: any;
  isLoggedIn$!: Observable<boolean>;
  product: any;
  quantity = 1
  currentUser!: User;
  wishListItems: any
  selectedRating = 0
  description = ''
  productId = 0
  allReview: ReviewData[] = []
  selectedPrice = 0
  productAttributes: any
  basicPrice = 0
  specialBasicPrice = 0
  attributes: any[] = []

  constructor(
    private apiService: ApiService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private wishListService: WishlistService,
    private authService: AuthService,
    private ref: ChangeDetectorRef
  ) { }

  get isFormValid(): boolean {
    return this.selectedRating > 0 && this.description !== ''
  }
  get filterReviewByUserEmail(): any {
    return this.allReview.find((element) => element.attributes.author.data.attributes.email)
  }
  get subTotalNote() {
    const notes = this.allReview.map(review => review.attributes.note);
    return notes.reduce((acc, current) => acc + current, 0);
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')

    this.activeRoute.params.subscribe(data => {
      this.productId = this.activeRoute.snapshot.params['id']
      this.loadReviewByProductId(this.productId)
      this.loadProductById(this.productId)
    })
  }

  handleAddToWishList(userEmail: string, productId: string) {
    const data = {
      "email": userEmail,
      "productId": productId

    }
    if (this.authService.getToken()) {
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
  saveReview(reviewDescription: any) {

    const closeBtn = this.closeBtn.nativeElement as HTMLElement

    const data = {
      "data": {
        "content": reviewDescription.value,
        "note": this.selectedRating,
        "product": this.product,
        "author": this.currentUser
      }
    }
    if (this.filterReviewByUserEmail) {
      this.apiService.updateReview(data, this.filterReviewByUserEmail.id).subscribe({
        next: (res) => {
          alert('Review added successfully.')
          this.loadReviewByProductId(this.productId)
          closeBtn.click()
          this.selectedRating = 0
          this.description = ''
        }
      })
    } else {
      this.apiService.addReview(data).subscribe({
        next: (res) => {
          alert('Review added successfully.')
          this.loadReviewByProductId(this.productId)
          closeBtn.click()
          this.selectedRating = 0
          this.description = ''
        }
      })
    }
  }
  loadWishListItems() {
    this.wishListService.getWishlistItems().subscribe({
      next: (response) => {
        this.wishListService.wishListCount.next(response.data.length)
        this.wishListItems = response.data.filter((item: any) => item.attributes.email === this.currentUser?.email)
      }
    })
  }
  loadReviewByProductId(id: number) {
    this.apiService.fetchReviewByProductId(id).subscribe({
      next: (reviewResponse) => {
        this.allReview = reviewResponse.data

        const currentReview = this.filterReviewByUserEmail
        this.description = currentReview?.attributes.content
      }
    })
  }
  loadProductById(id: number) {
    this.apiService.fetchProductById(id).subscribe({
      next: (res) => {

        this.product = res.data
        this.basicPrice = this.product.attributes.price
        this.specialBasicPrice = this.product.attributes.specialPrice
        this.productAttributes = this.product.attributes?.attributes

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
  }
  isItemExists(product: any): boolean {
    return this.cartService.itemInCart(product)
  }
  updateItemQty(arr: any, item: any): void {
    const existingItem = arr.find((cartItem: any) => cartItem.id === item.id);
    if (existingItem) {
      this.quantity = existingItem.attributes.quantity;
      item
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
    product.attributes.quantity = this.quantity
    product.attributes.stock = product.attributes.stock - this.quantity
    if (this.attributes.length) product.attributes.selectedAttributes = this.attributes
    this.cartService.addItemToCart(product)
  }
  removeFromCart(productId: number) {
    this.cartService.removeItemFromCart(productId)
  }
  onRatingChanged(rating: number) {
    this.selectedRating = rating;
  }
  onAttributeChange(priceAttribute: any) {
    const existingItemIndex = this.attributes.findIndex((attribute: any) => attribute.name === priceAttribute.name);
    if (existingItemIndex !== -1) {
      this.attributes[existingItemIndex] = priceAttribute
    } else {
      this.attributes.push(priceAttribute);
    }

    const totalPrice = this.attributes.reduce((acc, attribute) => acc + attribute.price, 0)
    this.selectedPrice = totalPrice
    this.updatePrice(this.selectedPrice)
  }
  updatePrice(price: number) {
    this.product.attributes.price = this.basicPrice + price
    if (this.product.attributes.specialPrice && this.product.attributes.isFixedPrice) {
      this.product.attributes.specialPrice = this.specialBasicPrice + price
    }
  }


  // updatePrice() {
  //   const priceAttribute = this.product.attributes.attributes.price
  //   const priceOption = priceAttribute.find((option: any) => option.size.includes(this.selectedSize) && option.color.includes(this.selectedColor));
  //   if (priceOption) {
  //     this.product.attributes.price = priceOption.value
  //   }
  //   if (priceOption && this.product.attributes.isFixedPrice) {
  //     this.product.attributes.specialPrice = priceOption.value
  //   }
  // }
  // customChange() {
  //   const cartesian = (sets: any) => {
  //     return sets.reduce(
  //       (acc: any, curr: any) => {
  //         return acc
  //           .map((x: any) => {
  //             return curr.map((y: any) => {
  //               return x.concat([y]);
  //             });
  //           })
  //           .flat();
  //       },
  //       [[]]
  //     );
  //   };
  //   const attributeValues = this.product.attributes.map((attribute: any) =>
  //     attribute.options.map((option: any) => option.value)
  //   );
  //   const variations = cartesian(attributeValues);
  //   return variations
  // }
}
