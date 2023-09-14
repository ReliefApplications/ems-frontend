import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafePieDonutChartComponent } from './pie-donut-chart.component';
import { NgChartsModule } from 'ng2-charts';

describe('SafePieChartComponent', () => {
  let component: SafePieDonutChartComponent;
  let fixture: ComponentFixture<SafePieDonutChartComponent>;

  beforeEach(async () => {
    window.ResizeObserver =
      window.ResizeObserver ||
      jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
      }));
    await TestBed.configureTestingModule({
      declarations: [SafePieDonutChartComponent],
      imports: [NgChartsModule],
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
