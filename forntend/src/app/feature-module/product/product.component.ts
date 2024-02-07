import { Component } from '@angular/core';
import { ApiService, ProductService } from 'src/app/core/core.index';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  allProducts: any
  baseUrl = 'http://localhost:1337'
  constructor(private apiService: ApiService, private product: ProductService) {
    apiService.fetchProducts().subscribe({
      next: (res) => {
        this.allProducts = res?.data
      }
    })
  }

  addToCart(item: any) {
    const obj = {
      id: item.id,
      stockQuantity: item.attributes.stockQuantity
    }
    this.product.addItemToCart(obj)
    alert('Product added to cart.')
  }

  calculateDiscountPercentage(originalPrice:any, discountedPrice:any) {
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
