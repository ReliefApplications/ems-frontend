import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayerPopupComponent } from './layer-popup.component';

describe('SafeLayerPopupComponent', () => {
  let component: SafeLayerPopupComponent;
  let fixture: ComponentFixture<SafeLayerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLayerPopupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
