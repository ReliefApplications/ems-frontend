import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeMapLayerComponent } from './map-layer.component';

describe('EditLayerModalComponent', () => {
  let component: SafeMapLayerComponent;
  let fixture: ComponentFixture<SafeMapLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeMapLayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeMapLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
