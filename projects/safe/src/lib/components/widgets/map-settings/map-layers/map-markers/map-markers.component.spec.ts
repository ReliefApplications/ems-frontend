import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMarkersComponent } from './map-markers.component';

describe('MapMarkersComponent', () => {
  let component: MapMarkersComponent;
  let fixture: ComponentFixture<MapMarkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapMarkersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
