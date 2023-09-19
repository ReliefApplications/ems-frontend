import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerPopupComponent } from './layer-popup.component';

describe('LayerPopupComponent', () => {
  let component: LayerPopupComponent;
  let fixture: ComponentFixture<LayerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayerPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
