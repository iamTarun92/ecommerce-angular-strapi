import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSelectionComponent } from './address-selection.component';

describe('AddressSelectionComponent', () => {
  let component: AddressSelectionComponent;
  let fixture: ComponentFixture<AddressSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressSelectionComponent]
    });
    fixture = TestBed.createComponent(AddressSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
