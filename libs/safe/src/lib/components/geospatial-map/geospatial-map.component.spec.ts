import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeospatialMapComponent } from './geospatial-map.component';

describe('GeospatialMapComponent', () => {
  let component: GeospatialMapComponent;
  let fixture: ComponentFixture<GeospatialMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeospatialMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeospatialMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
