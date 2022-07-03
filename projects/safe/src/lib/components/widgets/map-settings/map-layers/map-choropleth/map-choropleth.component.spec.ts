import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapClorophletComponent } from './map-choropleth.component';

describe('MapClorophletComponent', () => {
  let component: MapClorophletComponent;
  let fixture: ComponentFixture<MapClorophletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapClorophletComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapClorophletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
