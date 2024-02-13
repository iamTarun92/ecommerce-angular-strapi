import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureModuleComponent } from './feature-module.component';

const routes: Routes = [
  {
    path: '', component: FeatureModuleComponent,
    children: [
      { path: 'category', loadChildren: () => import('./category/category.module').then(m => m.CategoryModule) },
      { path: ':category/:categoryId', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
      { path: 'cart', loadChildren: () => import('./cart/cart.module').then(m => m.CartModule) },
      { path: 'checkout', loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule) },
    ]
  },
  { path: '', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureModuleRoutingModule { }
