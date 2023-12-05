import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavControlsMenuItemComponent } from './sidenav-controls-menu-item.component';

describe('SidenavControlsMenuItemComponent', () => {
  let component: SidenavControlsMenuItemComponent;
  let fixture: ComponentFixture<SidenavControlsMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidenavControlsMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavControlsMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
