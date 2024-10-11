import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExportActionComponent } from './dashboard-export-action.component';

describe('DashboardExportActionComponent', () => {
  let component: DashboardExportActionComponent;
  let fixture: ComponentFixture<DashboardExportActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardExportActionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardExportActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
