import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLayersComponent } from './map-layers.component';

describe('MapLayersComponent', () => {
  let component: MapLayersComponent;
  let fixture: ComponentFixture<MapLayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapLayersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
