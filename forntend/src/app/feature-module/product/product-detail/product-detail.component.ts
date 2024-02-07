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
  quantity = 1

  constructor(private apiService: ApiService, private activeRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(data => {
      const id = this.activeRoute.snapshot.params['id']
      this.apiService.fetchProductById(id).subscribe((res: any) => {
        this.product = res.data.attributes
        console.log(this.product);

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
}
