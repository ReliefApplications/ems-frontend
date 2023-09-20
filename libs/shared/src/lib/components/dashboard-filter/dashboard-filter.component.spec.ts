import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFilterComponent } from './dashboard-filter.component';

describe('DashboardFilterComponent', () => {
  let component: DashboardFilterComponent;
  let fixture: ComponentFixture<DashboardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
