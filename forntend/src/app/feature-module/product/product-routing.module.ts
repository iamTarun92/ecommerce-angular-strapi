import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: ':categoryId/:id',
        loadChildren: () => import('./product-detail/product-detail.module').then(m => m.ProductDetailModule)
      },
      {
        path: ':categoryId',
        loadChildren: () => import('./product-list/product-list.module').then(m => m.ProductListModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
