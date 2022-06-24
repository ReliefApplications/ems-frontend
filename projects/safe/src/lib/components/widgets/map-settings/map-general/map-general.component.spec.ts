import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGeneralComponent } from './map-general.component';

describe('MapGeneralComponent', () => {
  let component: MapGeneralComponent;
  let fixture: ComponentFixture<MapGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapGeneralComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
