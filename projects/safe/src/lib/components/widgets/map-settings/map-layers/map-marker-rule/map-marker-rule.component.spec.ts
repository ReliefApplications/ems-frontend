import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMarkerRuleComponent } from './map-marker-rule.component';

describe('MapMarkerRuleComponent', () => {
  let component: MapMarkerRuleComponent;
  let fixture: ComponentFixture<MapMarkerRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapMarkerRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMarkerRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
