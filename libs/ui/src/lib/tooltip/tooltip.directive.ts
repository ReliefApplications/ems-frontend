import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
} from '@angular/core';

/**
 * Directive that allows to display a tooltip on a given html element
 */
@Directive({
  selector: '[uiTooltip]',
})
export class TooltipDirective {
  @Input() uiTooltip = 'test';

  elToolTip: any;
  // Distance from tooltip and the host element
  tooltipSeparation = 5;

  // Default classes to render the tooltip
  classes = [
    'opacity-50',
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
  ] as const;

  /**
   * Constructor of the directive
   *
   * @param elementRef Tooltip host reference
   * @param renderer Angular renderer to work with DOM
   */
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  /**
   * Function that listen for the user's mouse to enter the element where the directive is placed
   */
  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.elToolTip) {
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
  removeHint() {
    for (const cl of this.classes) {
      this.renderer.removeClass(this.elToolTip, cl);
    }
    this.renderer.removeChild(document.body, this.elToolTip);
    this.elToolTip = null;
  }

  /**
   * Show the tooltip and place it on the screen accordingly to its width and height
   */
  showHint() {
    // Creation of the tooltip element
    this.createTooltipElement();

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
  }

  /**
   * Creates an span HTML element with the tooltip properties
   */
  private createTooltipElement(): void {
    this.elToolTip = this.renderer.createElement('span');
    const text = this.renderer.createText(this.uiTooltip);
    this.renderer.appendChild(this.elToolTip, text);
    this.renderer.appendChild(document.body, this.elToolTip);
    for (const cl of this.classes) {
      this.renderer.addClass(this.elToolTip, cl);
    }
  }
}
