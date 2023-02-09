import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafePieDonutChartComponent } from './pie-donut-chart.component';

describe('SafePieChartComponent', () => {
  let component: SafePieDonutChartComponent;
  let fixture: ComponentFixture<SafePieDonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafePieDonutChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePieDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
