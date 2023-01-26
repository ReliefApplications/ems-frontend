import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHeatmapComponent } from './map-heatmap.component';

describe('MapHeatmapComponent', () => {
  let component: MapHeatmapComponent;
  let fixture: ComponentFixture<MapHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapHeatmapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
