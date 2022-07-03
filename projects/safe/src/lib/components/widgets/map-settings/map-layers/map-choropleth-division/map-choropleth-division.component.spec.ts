import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChoroplethDivisionComponent } from './map-choropleth-division.component';

describe('MapChoroplethDivisionComponent', () => {
  let component: MapChoroplethDivisionComponent;
  let fixture: ComponentFixture<MapChoroplethDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapChoroplethDivisionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapChoroplethDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
