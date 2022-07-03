import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapClorophletDivisionComponent } from './map-choropleth-division.component';

describe('MapClorophletDivisionComponent', () => {
  let component: MapClorophletDivisionComponent;
  let fixture: ComponentFixture<MapClorophletDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapClorophletDivisionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapClorophletDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
