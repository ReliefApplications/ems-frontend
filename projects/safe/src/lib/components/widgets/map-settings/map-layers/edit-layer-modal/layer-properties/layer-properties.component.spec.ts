import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayerPropertiesComponent } from './layer-properties.component';

describe('SafeLayerPropertiesComponent', () => {
  let component: SafeLayerPropertiesComponent;
  let fixture: ComponentFixture<SafeLayerPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLayerPropertiesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayerPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
