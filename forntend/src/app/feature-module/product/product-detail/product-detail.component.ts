import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/common/api.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  id: any;
  product: any;
  quantity = 0

  constructor(private apiService: ApiService, private activeRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(data => {
      const id = this.activeRoute.snapshot.params['id']
      this.quantity = this.selectedCartItem(parseInt(id))?.quantity

      this.apiService.fetchProductById(id).subscribe({
        next: (res: any) => {
          this.product = res.data.attributes
        },
        error: () => {
          // this.router.navigate([''])
        }
      });
    })
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  selectedCartItem(id: number) {
    let localCartString = localStorage.getItem('addToCart');
    if (!localCartString) return false;
    let localCart = JSON.parse(localCartString);
    return localCart.find((obj: any) => obj.id === id);
  }
}
