import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDataDropdownComponent } from './reference-data-dropdown.component';

describe('ReferenceDataDropdownComponent', () => {
  let component: ReferenceDataDropdownComponent;
  let fixture: ComponentFixture<sharedReferenceDataDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDataDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
