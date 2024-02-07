import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureModuleComponent } from './feature-module.component';

describe('FeatureModuleComponent', () => {
  let component: FeatureModuleComponent;
  let fixture: ComponentFixture<FeatureModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureModuleComponent]
    });
    fixture = TestBed.createComponent(FeatureModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
