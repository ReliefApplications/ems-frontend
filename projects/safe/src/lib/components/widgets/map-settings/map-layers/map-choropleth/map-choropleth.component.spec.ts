import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChoroplethComponent } from './map-choropleth.component';

describe('MapChoroplethComponent', () => {
  let component: MapChoroplethComponent;
  let fixture: ComponentFixture<MapChoroplethComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapChoroplethComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapChoroplethComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
