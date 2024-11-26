import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TooltipComponent, TooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should display the tooltip text', () => {
    component.uiTooltip = 'Sample Tooltip';
    fixture.detectChanges(); // Trigger change detection

    const tooltipElement: HTMLElement =
      fixture.nativeElement.querySelector('span');
    expect(tooltipElement.textContent).toBe('Sample Tooltip');
  });
});
