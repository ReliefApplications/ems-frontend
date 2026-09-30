import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { TooltipModule } from './tooltip.module';

/**
 * Component for testing purposes
 */
@Component({
  template: `<button [uiTooltip]="hint">Random content</button>`,
})
class TestingComponent {
  /** Tooltip content used by the test host. */
  public hint = 'Helpful guidance';
}

describe('TooltipDirective', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  let component: TestingComponent;
  let overlayContainer: OverlayContainer;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestingComponent],
      imports: [OverlayModule, TooltipModule],
    }).createComponent(TestingComponent);
    overlayContainer = TestBed.inject(OverlayContainer);

    fixture.detectChanges(); // initial binding

    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('shows and hides the tooltip on keyboard focus', () => {
    const button = fixture.nativeElement.querySelector('button');

    button.dispatchEvent(new FocusEvent('focusin'));
    fixture.detectChanges();
    expect(overlayContainer.getContainerElement().textContent).toContain(
      component.hint
    );

    button.dispatchEvent(new FocusEvent('focusout'));
    fixture.detectChanges();
    expect(overlayContainer.getContainerElement().textContent).not.toContain(
      component.hint
    );
  });

  it('keeps the tooltip open while the host remains focused or hovered', () => {
    const button = fixture.nativeElement.querySelector('button');
    const tooltipText = () =>
      overlayContainer.getContainerElement().textContent;

    button.dispatchEvent(new FocusEvent('focusin'));
    button.dispatchEvent(new MouseEvent('mouseenter'));
    button.dispatchEvent(new MouseEvent('mouseleave'));
    expect(tooltipText()).toContain(component.hint);
    button.dispatchEvent(new FocusEvent('focusout'));
    expect(tooltipText()).not.toContain(component.hint);

    button.dispatchEvent(new MouseEvent('mouseenter'));
    button.dispatchEvent(new FocusEvent('focusin'));
    button.dispatchEvent(new FocusEvent('focusout'));
    expect(tooltipText()).toContain(component.hint);
    button.dispatchEvent(new MouseEvent('mouseleave'));
    expect(tooltipText()).not.toContain(component.hint);
  });
});
