import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatesComponent } from './dashboard-states.component';

describe('DashboardStatesComponent', () => {
  let component: DashboardStatesComponent;
  let fixture: ComponentFixture<DashboardStatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardStatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
