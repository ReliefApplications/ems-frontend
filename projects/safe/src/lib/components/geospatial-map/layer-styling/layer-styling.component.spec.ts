import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayerStylingComponent } from './layer-styling.component';

describe('LayerStylingComponent', () => {
  let component: SafeLayerStylingComponent;
  let fixture: ComponentFixture<SafeLayerStylingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeLayerStylingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayerStylingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
