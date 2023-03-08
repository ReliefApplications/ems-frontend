import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeDashboardFilterComponent } from './dashboard-filter.component';

describe('SafeDashboardFilterComponent', () => {
  let component: SafeDashboardFilterComponent;
  let fixture: ComponentFixture<SafeDashboardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeDashboardFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeDashboardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
