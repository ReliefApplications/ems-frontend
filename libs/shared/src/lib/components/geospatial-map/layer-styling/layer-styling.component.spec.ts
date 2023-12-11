import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerStylingComponent } from './layer-styling.component';

describe('LayerStylingComponent', () => {
  let component: LayerStylingComponent;
  let fixture: ComponentFixture<LayerStylingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayerStylingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerStylingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
