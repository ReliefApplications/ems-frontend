import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayerFieldsComponent } from './layer-fields.component';

describe('SafeLayerFieldsComponent', () => {
  let component: SafeLayerFieldsComponent;
  let fixture: ComponentFixture<SafeLayerFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLayerFieldsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayerFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
