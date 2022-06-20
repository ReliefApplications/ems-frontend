import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapClorophletsComponent } from './map-clorophlets.component';

describe('MapClorophletsComponent', () => {
  let component: MapClorophletsComponent;
  let fixture: ComponentFixture<MapClorophletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapClorophletsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapClorophletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
