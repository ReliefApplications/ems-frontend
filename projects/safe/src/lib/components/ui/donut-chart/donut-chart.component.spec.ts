import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeDonutChartComponent } from './donut-chart.component';

describe('SafeDonutChartComponent', () => {
  let component: SafeDonutChartComponent;
  let fixture: ComponentFixture<SafeDonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeDonutChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
