import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
  OnDestroy,
  Inject,
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
    'text-gray-100',
    'rounded-md',
    'absolute',
    'z-[9999]',
  ] as const;

  /**
   * Constructor of the directive
   *
   * @param document current DOCUMENT
   * @param elementRef Tooltip host reference
   * @param renderer Angular renderer to work with DOM
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
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
    this.removeHint();
  }

  /**
   * Destroy the tooltip and stop its display
   */
  private removeHint() {
    if (this.document.body.contains(this.elToolTip)) {
      this.renderer.removeChild(this.document.body, this.elToolTip);
    }
  }

  /**
   * Show the tooltip and place it on the screen accordingly to its width and height
   */
  private showHint() {
    // Fullscreen only renders the current fulsscreened element,
    // Therefor we check if exists to take it as a reference, else we use the document body by default
    const elementRef = this.document.fullscreenElement ?? this.document.body;
    this.elToolTip.textContent = this.uiTooltip;
    this.renderer.addClass(this.elToolTip, 'opacity-0');
    this.renderer.appendChild(elementRef, this.elToolTip);
    // Management of tooltip placement in the screen (including screen edges cases)
    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos = this.elToolTip.getBoundingClientRect();
    this.renderer.removeClass(this.elToolTip, 'opacity-0');
    this.renderer.removeChild(elementRef, this.elToolTip);

    const top = hostPos.bottom;
    const left = hostPos.left;
    const tooltipWidth = tooltipPos.width;
    const tooltipHeight = tooltipPos.height;

    //Default working case
    let topValue = `${top + this.tooltipSeparation}px`;
    let leftValue = `${left + 0.5 * (hostPos.width - tooltipWidth)}px`;
    // Case where it on the bottom
    if (tooltipHeight + top > window.innerHeight) {
      topValue = `${hostPos.top - this.tooltipSeparation - tooltipHeight}px`;
    }
    if (left + 0.5 * (hostPos.width - tooltipWidth) < 0) {
      leftValue = `${0}px`;
    }
    //Right placed case
    if (tooltipWidth + left > window.innerWidth) {
      leftValue = `${window.innerWidth - tooltipWidth}px`;
    }
    this.renderer.setStyle(this.elToolTip, 'top', topValue);
    this.renderer.setStyle(this.elToolTip, 'left', leftValue);
    this.renderer.appendChild(elementRef, this.elToolTip);
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
