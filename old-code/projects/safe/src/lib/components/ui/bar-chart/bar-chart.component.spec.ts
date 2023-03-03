import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeBarChartComponent } from './bar-chart.component';

describe('SafeBarChartComponent', () => {
  let component: SafeBarChartComponent;
  let fixture: ComponentFixture<SafeBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeBarChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
