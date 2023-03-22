import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLayerComponent } from './map-layer.component';

describe('MapLayerComponent', () => {
  let component: MapLayerComponent;
  let fixture: ComponentFixture<MapLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapLayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
