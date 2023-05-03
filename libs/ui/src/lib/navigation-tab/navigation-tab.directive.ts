import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[uiNavigationTab]',
})
export class NavigationTabDirective {
  @Input() selectedIndex = 0;
  @Input() vertical = false;
  @Output() selectedIndexChange = new EventEmitter<number>();

  content: any;
  // Distance from tooltip and the host element
  contentSeparation = 5;

  // Default classes to render content
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
  @HostListener('focusin', ['$event.target'])
  onFocusIn(target: any) {
    if (!this.content) {
      this.showContent(target);
    }
  }

  /**
   * Function that listen for the user's mouse to quit the element where the directive is placed
   */
  @HostListener('focusout')
  onFocusOut() {
    if (this.content) {
      this.removeContent();
    }
  }

  /**
   * Destroy the tooltip and stop its display
   */
  removeContent() {
    for (const cl of this.classes) {
      this.renderer.removeClass(this.content, cl);
    }
    this.renderer.removeChild(document.body, this.content);
    this.content = null;
  }

  /**
   * Show the tooltip and place it on the screen accordingly to its width and height
   */
  showContent(target: any) {
    // NEED TO COPY
    console.log(target.parentElement.children[1]);
    this.content = target.parentElement.children[1];
    this.content.visibility = 'block';
    this.renderer.appendChild(document.body, this.content);
    // console.log(this.content);

    // // Management of tooltip placement in the screen (including screen edges cases)
    // const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    // const tooltipPos = this.elToolTip.getBoundingClientRect();

    // const top = hostPos.bottom;
    // const left = hostPos.left;
    // const tooltipWidth = tooltipPos.width;
    // const tooltipHeight = tooltipPos.height;

    // //Default working case
    // let topValue = `${top + this.tooltipSeparation}px`;
    // let leftValue = `${left}px`;
    // // Case where it is both on the bottom and on the right of the screen
    // if (
    //   tooltipHeight + top > window.innerHeight &&
    //   tooltipWidth + left > window.innerWidth
    // ) {
    //   topValue = `${hostPos.top - this.tooltipSeparation - tooltipHeight}px`;
    //   leftValue = `${window.innerWidth - tooltipWidth}px`;
    // }
    // //Bottom centered case (not to be placed first but after other allegations)
    // else if (tooltipHeight + top > window.innerHeight) {
    //   topValue = `${hostPos.top - this.tooltipSeparation - tooltipHeight}px`;
    //   leftValue = `${left}px`;
    // }
    // //Right placed case
    // else if (tooltipWidth + left > window.innerWidth) {
    //   topValue = `${top + this.tooltipSeparation}px`;
    //   leftValue = `${window.innerWidth - tooltipWidth}px`;
    // }
    // this.renderer.setStyle(this.elToolTip, 'top', topValue);
    // this.renderer.setStyle(this.elToolTip, 'left', leftValue);
  }
}
