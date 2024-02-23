import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, CartService } from 'src/app/core/core.index';
import { ProductData } from 'src/app/core/models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: ProductData[] = []
  baseUrl = 'http://localhost:1337'


  constructor(private apiService: ApiService, private cartService: CartService, private activeRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(data => {
      const categoryId = this.activeRoute.snapshot.params['categoryId']
      this.apiService.fetchProductByCategory(categoryId).subscribe({
        next: (res: any) => {
          this.products = res?.data
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
}
