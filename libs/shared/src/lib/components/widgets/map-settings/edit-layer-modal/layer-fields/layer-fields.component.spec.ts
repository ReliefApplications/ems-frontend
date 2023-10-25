import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerFieldsComponent } from './layer-fields.component';

describe('LayerFieldsComponent', () => {
  let component: LayerFieldsComponent;
  let fixture: ComponentFixture<LayerFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayerFieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
