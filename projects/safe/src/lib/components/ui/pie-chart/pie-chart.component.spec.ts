import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafePieChartComponent } from './pie-chart.component';

describe('SafePieChartComponent', () => {
  let component: SafePieChartComponent;
  let fixture: ComponentFixture<SafePieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafePieChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
