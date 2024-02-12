import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconPickerPopupComponent } from './icon-picker-popup.component';

describe('IconPickerPopupComponent', () => {
  let component: IconPickerPopupComponent;
  let fixture: ComponentFixture<IconPickerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconPickerPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconPickerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
