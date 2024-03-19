import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss']
})
export class SelectDropdownComponent implements OnInit {
  @Input() attribute: any;
  @Output() setAttributeSelected = new EventEmitter<any>();
  selectedAttribute = ''

  constructor() { }

  ngOnInit(): void {
    // this.selectedAttribute = this.attribute.options[0].value
  }

  setPrice(attribute: any) {
    const option = attribute.options.find((option: any) => option.value === this.selectedAttribute)
    const name = attribute.name
    const value = option.value
    const price = option.price
    this.setAttributeSelected.emit({ name, value, price });
  }
}
