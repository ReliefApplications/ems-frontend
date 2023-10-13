import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientPickerPopupComponent } from './gradient-picker-popup.component';

describe('GradientPickerPopupComponent', () => {
  let component: GradientPickerPopupComponent;
  let fixture: ComponentFixture<GradientPickerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradientPickerPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GradientPickerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
