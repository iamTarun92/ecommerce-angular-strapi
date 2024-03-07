import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressSelectionComponent } from './components/address-selection/address-selection.component';



@NgModule({
  declarations: [
    StarRatingComponent,
    AddressSelectionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    StarRatingComponent,
    AddressSelectionComponent
  ]
})
export class SharedModule { }
