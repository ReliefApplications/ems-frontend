import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFilterIconComponent } from './dashboard-filter-icon.component';

describe('DashboardFilterIconComponent', () => {
  let component: DashboardFilterIconComponent;
  let fixture: ComponentFixture<DashboardFilterIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFilterIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardFilterIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
