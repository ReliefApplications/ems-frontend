import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapZoomComponent } from './map-zoom.component';

describe('MapZoomComponent', () => {
  let component: MapZoomComponent;
  let fixture: ComponentFixture<MapZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapZoomComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
