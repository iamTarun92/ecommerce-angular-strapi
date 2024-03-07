import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/core.index';
import { AddressData } from 'src/app/core/models/address';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  isAddFormSelected = false
  isActive = true
  currentUser: any
  addAddressForm!: FormGroup
  allAddress: AddressData[] = []


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
  ) { }


  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')
    this.loadAddress()

    this.addAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }


  loadAddress() {
    this.apiService.fetchAddressByEmail(this.currentUser.email).subscribe({
      next: res => {
        this.allAddress = res.data
      }
    })
  }
  saveAddress() {

    const data = {
      "data": {
        email: this.currentUser.email,
        ...this.addAddressForm.value
      }
    }
    this.apiService.addAddress(data).subscribe({
      next: res => {
        this.isAddFormSelected = !this.isAddFormSelected
        this.addAddressForm.reset();
      }
    })

  }

  cancelSaveAddress() {
    this.isAddFormSelected = !this.isAddFormSelected
    this.addAddressForm.reset();
  }

}
