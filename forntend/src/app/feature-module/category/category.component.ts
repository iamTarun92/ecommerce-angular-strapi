import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/core.index';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  categories:any
  constructor(private apiService: ApiService,) {
    apiService.fetchCategories().subscribe({
      next: (res) => {       
        this.categories = res?.data
      }
    })
  }
}
