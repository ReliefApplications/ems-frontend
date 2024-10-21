import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExportModalComponent } from './dashboard-export-modal.component';

describe('DashboardExportModalComponent', () => {
  let component: DashboardExportModalComponent;
  let fixture: ComponentFixture<DashboardExportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardExportModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardExportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
