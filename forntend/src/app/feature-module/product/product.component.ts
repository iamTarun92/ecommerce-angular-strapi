import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { ApiService, CartService } from 'src/app/core/core.index';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  allProducts: any | undefined
  baseUrl = 'http://localhost:1337'
  constructor(private apiService: ApiService, private product: CartService, private activeRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(data => {
      const categoryId = this.activeRoute.snapshot.params['categoryId']
      this.apiService.fetchProductByCategory(categoryId).subscribe({
        next: (res: any) => {
          this.allProducts = res?.data
        },
        error: () => {
          this.router.navigate([''])
        }
      });
    })
  }

  addToCart(product: any) {
    const obj = {
      ...product,
      quantity: 1
    }
    this.product.addItemToCart(obj)
    // alert('Product added to cart.')
  }

  removeToCart(productId: number) {
    this.product.removeItemFromCart(productId)
  }

  checkIfExists(id: string): boolean {
    let localCart = localStorage.getItem('addToCart')
    if (localCart) {
      return JSON.parse(localCart).some((element: any) => element.id === id)
    }
    return false
  }

  calculateDiscountPercentage(originalPrice: any, discountedPrice: any) {
    // Ensure both prices are non-negative
    if (originalPrice < 0 || discountedPrice < 0) {
      throw new Error('Prices must be non-negative.');
    }

    // Calculate the discount amount
    const discountAmount = originalPrice - discountedPrice;

    // Calculate the discount percentage
    const discountPercentage = (discountAmount / originalPrice) * 100;

    return discountPercentage;
  }

}
