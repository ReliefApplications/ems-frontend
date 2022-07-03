import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChoroplethsComponent } from './map-choropleths.component';

describe('MapChoroplethsComponent', () => {
  let component: MapChoroplethsComponent;
  let fixture: ComponentFixture<MapChoroplethsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapChoroplethsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapChoroplethsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
