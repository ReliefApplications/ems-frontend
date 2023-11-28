import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFilterSettingsComponent } from './dashboard-filter-settings.component';

describe('DashboardFilterSettingsComponent', () => {
  let component: DashboardFilterSettingsComponent;
  let fixture: ComponentFixture<DashboardFilterSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardFilterSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardFilterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
