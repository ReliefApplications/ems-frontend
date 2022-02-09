import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeFormsDropdownComponent } from './forms-dropdown.component';

describe('SafeFormsDropdownComponent', () => {
  let component: SafeFormsDropdownComponent;
  let fixture: ComponentFixture<SafeFormsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeFormsDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFormsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
