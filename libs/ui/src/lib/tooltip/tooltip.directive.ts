import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
  OnDestroy,
} from '@angular/core';

/**
 * Directive that allows to display a tooltip on a given html element
 */
@Directive({
  selector: '[uiTooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input() uiTooltip = '';
  @Input() tooltipDisabled = false;

  private elToolTip!: HTMLSpanElement;
  // Distance from tooltip and the host element
  private tooltipSeparation = 5;

  // Default classes to render the tooltip
  private tooltipClasses = [
    'opacity-70',
    'transition-opacity',
    'delay-300',
    'bg-gray-800',
    'p-2',
    'max-w-xs',
    'whitespace-pre-wrap',
    'text-xs',
    'text-justify',
    'text-gray-100',
    'rounded-md',
    'absolute',
    'z-[9999]',
  ] as const;

  /**
   * Constructor of the directive
   *
   * @param elementRef Tooltip host reference
   * @param renderer Angular renderer to work with DOM
   */
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    // Creation of the tooltip element
    this.createTooltipElement();
  }

  /**
   * Function that listen for the user's mouse to enter the element where the directive is placed
   */
  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.uiTooltip && !this.tooltipDisabled) {
      this.showHint();
    }
  }

  /**
   * Function that listen for the user's mouse to quit the element where the directive is placed
   */
  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.elToolTip) {
      this.removeHint();
    }
  }

  /**
   * Destroy the tooltip and stop its display
   */
  private removeHint() {
    this.renderer.removeChild(document.body, this.elToolTip);
  }

  /**
   * Show the tooltip and place it on the screen accordingly to its width and height
   */
  private showHint() {
    this.elToolTip.textContent = this.uiTooltip;
    // Management of tooltip placement in the screen (including screen edges cases)
    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos = this.elToolTip.getBoundingClientRect();

    const top = hostPos.bottom;
    const left = hostPos.left;
    const tooltipWidth = tooltipPos.width;
    const tooltipHeight = tooltipPos.height;

    //Default working case
    let topValue = `${top + this.tooltipSeparation}px`;
    let leftValue = `${left}px`;
    // Case where it is both on the bottom and on the right of the screen
    if (
      tooltipHeight + top > window.innerHeight &&
      tooltipWidth + left > window.innerWidth
    ) {
      topValue = `${hostPos.top - this.tooltipSeparation - tooltipHeight}px`;
      leftValue = `${window.innerWidth - tooltipWidth}px`;
    }
    //Bottom centered case (not to be placed first but after other allegations)
    else if (tooltipHeight + top > window.innerHeight) {
      topValue = `${hostPos.top - this.tooltipSeparation - tooltipHeight}px`;
      leftValue = `${left}px`;
    }
    //Right placed case
    else if (tooltipWidth + left > window.innerWidth) {
      topValue = `${top + this.tooltipSeparation}px`;
      leftValue = `${window.innerWidth - tooltipWidth}px`;
    }
    this.renderer.setStyle(this.elToolTip, 'top', topValue);
    this.renderer.setStyle(this.elToolTip, 'left', leftValue);
    this.renderer.appendChild(document.body, this.elToolTip);
  }

  /**
   * Creates an span HTML element with the tooltip properties
   */
  private createTooltipElement(): void {
    this.elToolTip = this.renderer.createElement('span');
    for (const cl of this.tooltipClasses) {
      this.renderer.addClass(this.elToolTip, cl);
    }
  }

  /**
   * If the element is gone but we don't move cursor out,
   * remove the tooltip by default
   */
  ngOnDestroy(): void {
    this.removeHint();
  }
}
