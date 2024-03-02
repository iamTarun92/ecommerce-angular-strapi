import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {

  @Input() rating: number = 0;
  @Input() readOnly: boolean = false;
  @Input() name: string = '';
  selectedStar!: number;
  ratingStar = [1, 2, 3, 4, 5];

  @Output() ratingChanged = new EventEmitter<number>();

  ngOnInit() {
    this.selectedStar = this.rating;
  }

  // Function to handle rating selection
  onRatingChanged(star: number) {
    if (!this.readOnly) {
      this.selectedStar = star;
      this.ratingChanged.emit(this.selectedStar);
    }
  }

  isStarSelected(star: number): boolean {
    return star === this.selectedStar;
  }
}
