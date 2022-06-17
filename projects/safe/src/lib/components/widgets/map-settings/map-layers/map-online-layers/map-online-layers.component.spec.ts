import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOnlineLayersComponent } from './map-online-layers.component';

describe('MapOnlineLayersComponent', () => {
  let component: MapOnlineLayersComponent;
  let fixture: ComponentFixture<MapOnlineLayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapOnlineLayersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOnlineLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
