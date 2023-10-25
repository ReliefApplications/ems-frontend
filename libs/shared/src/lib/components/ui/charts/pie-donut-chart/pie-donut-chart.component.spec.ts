import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieDonutChartComponent } from './pie-donut-chart.component';

describe('PieChartComponent', () => {
  let component: PieDonutChartComponent;
  let fixture: ComponentFixture<PieDonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieDonutChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
