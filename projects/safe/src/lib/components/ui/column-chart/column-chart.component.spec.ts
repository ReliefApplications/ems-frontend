import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeColumnChartComponent } from './column-chart.component';

describe('SafeColumnChartComponent', () => {
  let component: SafeColumnChartComponent;
  let fixture: ComponentFixture<SafeColumnChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeColumnChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
