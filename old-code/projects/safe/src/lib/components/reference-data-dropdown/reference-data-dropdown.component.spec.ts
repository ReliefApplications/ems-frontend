import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeReferenceDataDropdownComponent } from './reference-data-dropdown.component';

describe('SafeReferenceDataDropdownComponent', () => {
  let component: SafeReferenceDataDropdownComponent;
  let fixture: ComponentFixture<SafeReferenceDataDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeReferenceDataDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeReferenceDataDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
