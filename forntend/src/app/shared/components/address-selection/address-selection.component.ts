import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/core.index';
import { AddressData } from 'src/app/core/models/address';

@Component({
  selector: 'app-address-selection',
  templateUrl: './address-selection.component.html',
  styleUrls: ['./address-selection.component.scss']
})
export class AddressSelectionComponent implements OnInit {

  @Input() addresses: any | AddressData[];
  @Input() name: string = '';
  @Input() currentUser: any;
  @Output() addressSelected = new EventEmitter<any>();

  editAddressForm!: FormGroup
  selectedAddress: any
  isEditFormSelected = false
  selectedAddressIndex=0

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }


  ngOnInit(): void {
    this.editAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required,]],
      type: ['', [Validators.required,]]
    })
  }


  onAddressSelected(address: AddressData) {
    this.selectedAddress = address
    this.addressSelected.emit(address);
  }

  editAddress(address: AddressData) {
    const formData = {
      ...address.attributes
    }
    this.isEditFormSelected = !this.isEditFormSelected
    this.selectedAddress = address
    this.editAddressForm.patchValue(formData)
  }

  updateAddress() {
    const index = this.addresses.findIndex((addresse: AddressData) => addresse.id === this.selectedAddress.id);
    this.addresses[index] = {
      id: this.addresses[index].id,
      attributes: {
        ...this.addresses[index].attributes,
        ...this.editAddressForm.value
      }
    }
    this.onAddressSelected(this.addresses[index])
    this.isEditFormSelected = !this.isEditFormSelected
    this.editAddressForm.reset();
    const data = {
      "data": {
        "email": this.currentUser.email,
        "phone": this.currentUser.phone,
        "address": 'wwwwwwwwww'
      }
    }
    this.apiService.updateAddress(data, this.selectedAddress.id).subscribe({
      next: res => alert('done')
    })
  }

  cancelEditAddress() {
    this.isEditFormSelected = !this.isEditFormSelected
    this.editAddressForm.reset();
  }
}
