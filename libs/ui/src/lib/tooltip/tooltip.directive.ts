import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
  OnDestroy,
  Inject,
  OnInit,
} from '@angular/core';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Directive that allows to display a tooltip on a given html element
 */
@Directive({
  selector: '[uiTooltip]',
})
export class TooltipDirective implements OnDestroy {
  /** Tooltip text */
  @Input() uiTooltip = '';
  /** Is tooltip disabled */
  @Input() tooltipDisabled = false;
  /** Tooltip html element */
  private elToolTip!: HTMLSpanElement;
  /** Distance from tooltip and the host element in px ( when possible ) */
  private tooltipSeparation = 5;

  // Default classes to render the tooltip
  private tooltipClasses = [
    'opacity-85',
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
    'break-words',
  ] as const;

  /** Position of the tooltip */
  private position!: TooltipPosition;

  /**
   * Tooltip directive.
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
    // Fullscreen only renders the current full-screened element,
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

    let top = 0;
    let left = 0;
    const tooltipWidth = tooltipPos.width;
    const tooltipHeight = tooltipPos.height;

    // Gets the preferred position from the data attribute
    // set by the TooltipPositionDirective
    this.position =
      this.elementRef.nativeElement.dataset.tooltipPosition ?? 'bottom';

    switch (this.position) {
      case 'top': {
        top = hostPos.top - tooltipHeight - this.tooltipSeparation;
        left = hostPos.left + hostPos.width / 2 - tooltipWidth / 2;
        break;
      }
      case 'bottom': {
        top = hostPos.bottom + this.tooltipSeparation;
        left = hostPos.left + hostPos.width / 2 - tooltipWidth / 2;
        break;
      }
      case 'left': {
        top = hostPos.top + hostPos.height / 2 - tooltipHeight / 2;
        left = hostPos.left - tooltipWidth - this.tooltipSeparation;
        break;
      }
      case 'right': {
        top = hostPos.top + hostPos.height / 2 - tooltipHeight / 2;
        left = hostPos.right + this.tooltipSeparation;
        break;
      }
    }

    // Clamp the tooltip position to the screen edges
    top = Math.max(0, Math.min(top, window.innerHeight - tooltipHeight));
    left = Math.max(0, Math.min(left, window.innerWidth - tooltipWidth));

    this.renderer.setStyle(this.elToolTip, 'top', `${top}px`);
    this.renderer.setStyle(this.elToolTip, 'left', `${left}px`);
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

/**
 * Directive that allows selecting the preferred position of the tooltip
 */
@Directive({
  selector: '[uiTooltipPosition]',
})
export class TooltipPositionDirective implements OnInit {
  @Input('uiTooltipPosition') position: TooltipPosition = 'bottom';

  /**
   * Directive that allows selecting the preferred position of the tooltip
   *
   * @param elementRef Tooltip host reference
   */
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const tooltipElement = this.elementRef.nativeElement;
    if (tooltipElement) {
      // Add data attribute to the host element
      tooltipElement.dataset.tooltipPosition = this.position;
    }
  }
}
