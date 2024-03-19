import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/core.index';
import { BannerData } from 'src/app/core/models/banner';
import { CategoriesData } from 'src/app/core/models/categories';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: CategoriesData[] = [];
  banners: BannerData[] = [];

  constructor(private apiService: ApiService,) { }

  ngOnInit(): void {
    this.apiService.fetchCategories().subscribe({
      next: (res) => {
        this.categories = res.data
      },
      error: (err) => {
        alert('404 Error.')
      },
    })
    this.apiService.fetchBanner().subscribe({
      next: (res) => {
        this.banners = res.data
        this.banners.sort((a, b) => parseInt(a.attributes.orderBy) - parseInt(b.attributes.orderBy)
        )

      },
      error: (err) => {
        alert('404 Error.')
      },
    })
  }
}
