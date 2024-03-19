import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressSelectionComponent } from './components/address-selection/address-selection.component';
import { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component';



@NgModule({
  declarations: [
    StarRatingComponent,
    AddressSelectionComponent,
    SelectDropdownComponent
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
    AddressSelectionComponent,
    SelectDropdownComponent
  ]
})
export class SharedModule { }
