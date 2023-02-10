import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeMapPopupComponent } from './map-popup.component';

describe('SafeMapPopupComponent', () => {
  let component: SafeMapPopupComponent;
  let fixture: ComponentFixture<SafeMapPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeMapPopupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeMapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
