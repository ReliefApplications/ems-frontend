import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLineChartComponent } from './line-chart.component';

describe('SafeLineChartComponent', () => {
  let component: SafeLineChartComponent;
  let fixture: ComponentFixture<SafeLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLineChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
