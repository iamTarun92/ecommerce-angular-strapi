import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    StarRatingComponent
  ]
})
export class SharedModule { }
