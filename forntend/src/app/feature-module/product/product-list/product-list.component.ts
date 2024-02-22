import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, CartService } from 'src/app/core/core.index';
import { ProductData } from 'src/app/core/models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  parseInt(arg0: string) {
    throw new Error('Method not implemented.');
  }
  allProducts: ProductData[] = []
  baseUrl = 'http://localhost:1337'
  constructor(private apiService: ApiService, private product: CartService, private activeRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(data => {
      const categoryId = this.activeRoute.snapshot.params['categoryId']
      this.apiService.fetchProductByCategory(categoryId).subscribe({
        next: (res: any) => {
          this.allProducts = res?.data
          console.log(this.allProducts);
        },
        error: () => {
          this.router.navigate([''])
        }
      });
    })
  }

  addToCart(product: any) {
    product.quantity = 1
    this.product.addItemToCart(product)
  }

  removeFromCart(productId: number) {
    this.product.removeItemFromCart(productId)
  }

  checkIfExists(id: number): boolean {
    let localCart = localStorage.getItem('cartItems')
    if (localCart) {
      return JSON.parse(localCart).some((element: any) => element.id === id)
    }
    return false
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    return originalPrice - (originalPrice * discountPercentage / 100);
  }

  hasFixedPrice(product: any): boolean {
    return product.attributes.isFixedPrice

  }
  hasSpecialPrice(product: any): boolean {
    return !!product.attributes.specialPrice
  }
}
