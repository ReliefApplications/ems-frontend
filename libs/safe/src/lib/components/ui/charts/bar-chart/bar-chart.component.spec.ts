import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeBarChartComponent } from './bar-chart.component';
import { NgChartsModule } from 'ng2-charts';

describe('SafeBarChartComponent', () => {
  let component: SafeBarChartComponent;
  let fixture: ComponentFixture<SafeBarChartComponent>;

  beforeEach(async () => {
    window.ResizeObserver =
      window.ResizeObserver ||
      jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
      }));
    await TestBed.configureTestingModule({
      declarations: [SafeBarChartComponent],
      imports: [NgChartsModule],
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
