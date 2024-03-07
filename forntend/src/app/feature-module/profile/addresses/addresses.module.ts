import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressesRoutingModule } from './addresses-routing.module';
import { AddressesComponent } from './addresses.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AddressesComponent
  ],
  imports: [
    CommonModule,
    AddressesRoutingModule,
    SharedModule
  ]
})
export class AddressesModule { }
