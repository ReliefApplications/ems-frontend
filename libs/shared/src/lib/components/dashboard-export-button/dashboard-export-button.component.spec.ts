import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExportButtonComponent } from './dashboard-export-button.component';

describe('DashboardExportButtonComponent', () => {
  let component: DashboardExportButtonComponent;
  let fixture: ComponentFixture<DashboardExportButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardExportButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardExportButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
