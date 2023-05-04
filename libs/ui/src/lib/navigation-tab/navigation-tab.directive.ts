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
  @Output() selectedIndexChangeDirective = new EventEmitter<number>();

  content: any;
  // Distance from tooltip and the host element
  contentSeparation = 5;

  // Default classes to render content
  classes = [
    'transition',
    'ease-in-out',
    'delay-150',
    'duration-300',
    'block',
    'py-4',
    'hover:bg-indigo-500',
    'hover:scale-110',
  ] as const;

  /**
   * Constructor of the directive
   *
   * @param elementRef Tooltip host reference
   * @param renderer Angular renderer to work with DOM
   */
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const host = this.elementRef.nativeElement;
    const tabsWrapper = host?.children[0];

    if (this.vertical) {
      for (const tab of tabsWrapper.children) {
        const tabButton = tab?.children[0]?.children[0];
        this.renderer.removeClass(tabButton, 'border-b-2');
        this.renderer.addClass(tabButton, 'border-r-2');
      }
    }

    const initialTabButton =
      tabsWrapper?.children[this.selectedIndex]?.children[0]?.children[0];
    // console.log(initialTabButton.parentElement.children[1].id);
    // console.log(
    //   tabsWrapper?.children[this.selectedIndex]?.children[0]?.children[0]
    // );
    if (initialTabButton?.parentElement?.children[1]?.id === 'content') {
      this.showContent(initialTabButton);
    }
  }

  /**
   * Function that listen for the user's mouse to enter the element where the directive is placed
   */
  @HostListener('click', ['$event'])
  onClick(event: any) {
    // console.log('content when clicking : ');
    // console.log(this.content);
    if (event.target.parentElement.children[1].id === 'content') {
      this.showContent(event.target);
      event.stopPropagation();
    }
  }

  /**
   * Show the tooltip and place it on the screen accordingly to its width and height
   */
  showContent(target: any) {
    // NEED TO COPY
    const currentTabSelected = target.parentElement.parentElement;
    for (const tab of currentTabSelected.parentElement.children) {
      if (tab.isSameNode(currentTabSelected)) {
        this.selectedIndexChangeDirective.emit(
          Array.prototype.indexOf.call(
            currentTabSelected.parentElement.children,
            tab
          )
        );
        // console.log(
        //   Array.prototype.indexOf.call(
        //     currentTabSelected.parentElement.children,
        //     tab
        //   )
        // );
      }
    }

    const wrappingDiv =
      target.parentElement.parentElement.parentElement.parentElement;

    if (this.content) {
      // console.log(target.parentElement.children[1]);
      // console.log(target.parentElement.children[1].id);
      for (const cl of this.classes) {
        this.renderer.removeClass(this.content, cl);
      }
      this.renderer.removeChild(wrappingDiv, this.content);
      this.content = null;
    }

    // console.log(target.parentElement.children[1]);
    // this.content = target.parentElement.children[1].outerHTML;
    // console.log(target.parentElement.children[1].id);
    this.content = this.renderer.createElement('div');
    this.content.innerHTML = target.parentElement.children[1].innerHTML;
    // console.log(
    //   target.parentElement.parentElement.parentElement.parentElement
    // );
    // console.log(target.parentElement.parentElement.parentElement);
    // console.log(target.parentElement.parentElement);
    // this.content.appendChild(target.parentElement.children[1].innerHTML);
    // console.log(this.content);
    // this.renderer.removeClass(this.content.children[0], 'hidden');
    // this.renderer.addClass(this.content.children[0], 'block');
    for (const cl of this.classes) {
      this.renderer.addClass(this.content, cl);
    }
    if (this.vertical) {
      this.renderer.addClass(this.content, 'col-span-5');
      this.renderer.addClass(this.content, 'px-4');
    }
    // this.renderer.addClass(this.content, 'block');
    // this.renderer.addClass(this.content, 'py-4');
    this.renderer.appendChild(wrappingDiv, this.content);
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
