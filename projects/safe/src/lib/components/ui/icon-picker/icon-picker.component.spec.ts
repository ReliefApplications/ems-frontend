import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeIconPickerComponent } from './icon-picker.component';

describe('SafeIconPickerComponent', () => {
  let component: SafeIconPickerComponent;
  let fixture: ComponentFixture<SafeIconPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeIconPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeIconPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
