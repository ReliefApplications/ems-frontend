import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDashboardTemplatesComponent } from './manage-dashboard-templates.component';

describe('ManageDashboardTemplatesComponent', () => {
  let component: ManageDashboardTemplatesComponent;
  let fixture: ComponentFixture<ManageDashboardTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageDashboardTemplatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageDashboardTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
