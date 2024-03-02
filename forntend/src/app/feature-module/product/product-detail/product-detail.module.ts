import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { ProductDetailComponent } from './product-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    ProductDetailRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class ProductDetailModule { }
