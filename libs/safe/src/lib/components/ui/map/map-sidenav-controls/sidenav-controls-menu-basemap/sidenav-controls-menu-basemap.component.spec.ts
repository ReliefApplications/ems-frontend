import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavControlsMenuBasemapComponent } from './sidenav-controls-menu-basemap.component';

describe('SidenavControlsMenuBasemapComponent', () => {
  let component: SidenavControlsMenuBasemapComponent;
  let fixture: ComponentFixture<SidenavControlsMenuBasemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidenavControlsMenuBasemapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavControlsMenuBasemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
