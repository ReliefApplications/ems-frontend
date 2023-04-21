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
  @Input() toolTipHint = 'test';

  elToolTip: any;

  classes = [
    'opacity-60',
    'transition-opacity',
    'bg-gray-800',
    'px-1',
    'text-sm',
    'text-gray-100',
    'rounded-md',
    'absolute',
  ];

  /**
   * Constructor of the directive
   * @param elementRef
   * @param renderer
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
    this.elToolTip = this.renderer.createElement('span');
    const text = this.renderer.createText(this.toolTipHint);
    this.renderer.appendChild(this.elToolTip, text);
    this.renderer.appendChild(document.body, this.elToolTip);
    for (const cl of this.classes) {
      this.renderer.addClass(this.elToolTip, cl);
    }

    // Management of tooltip placement in the screen (including screen edges cases)
    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos = this.elToolTip.getBoundingClientRect();

    const top = hostPos.bottom;
    const left = hostPos.left;
    const tooltipWidth = tooltipPos.width;
    const tooltipHeight = tooltipPos.height;

    // Case where it is both on the bottom and on the right of the screen
    if (
      tooltipHeight + top > window.innerHeight &&
      tooltipWidth + left > window.innerWidth
    ) {
      this.renderer.setStyle(
        this.elToolTip,
        'top',
        `${hostPos.top - tooltipHeight}px`
      );
      this.renderer.setStyle(
        this.elToolTip,
        'left',
        `${window.innerWidth - tooltipWidth}px`
      );
    }
    //Bottom centered case (not to be placed first but after other allegations)
    else if (tooltipHeight + top > window.innerHeight) {
      this.renderer.setStyle(
        this.elToolTip,
        'top',
        `${hostPos.top - tooltipHeight}px`
      );
      this.renderer.setStyle(this.elToolTip, 'left', `${left}px`);
    }
    //Right placed case
    else if (tooltipWidth + left > window.innerWidth) {
      this.renderer.setStyle(this.elToolTip, 'top', `${top}px`);
      this.renderer.setStyle(
        this.elToolTip,
        'left',
        `${window.innerWidth - tooltipWidth}px`
      );
    }
    //Default working case
    else {
      this.renderer.setStyle(this.elToolTip, 'top', `${top}px`);
      this.renderer.setStyle(this.elToolTip, 'left', `${left}px`);
    }
  }
}
