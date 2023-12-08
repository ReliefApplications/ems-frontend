import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSidenavControlsComponent } from './map-sidenav-controls.component';

describe('MapSidenavControlsComponent', () => {
  let component: MapSidenavControlsComponent;
  let fixture: ComponentFixture<MapSidenavControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapSidenavControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapSidenavControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
