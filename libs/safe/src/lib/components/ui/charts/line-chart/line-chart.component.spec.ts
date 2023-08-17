import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeLineChartComponent } from './line-chart.component';
import { NgChartsModule } from 'ng2-charts';

describe('SafeLineChartComponent', () => {
  let component: SafeLineChartComponent;
  let fixture: ComponentFixture<SafeLineChartComponent>;

  beforeEach(async () => {
    window.ResizeObserver =
      window.ResizeObserver ||
      jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
      }));
    await TestBed.configureTestingModule({
      declarations: [SafeLineChartComponent],
      imports: [NgChartsModule],
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
