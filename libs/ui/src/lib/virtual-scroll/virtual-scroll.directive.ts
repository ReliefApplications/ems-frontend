import {
  Attribute,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

/**
 * Virtual scroll directive
 */
@Directive({
  selector: '[uiVirtualScroll]',
  standalone: true,
})
export class VirtualScrollDirective implements OnChanges, OnDestroy {
  @Input() checkItemList = false;
  private parentContainerScrollHeight = 0;
  private currentItemSize = 50;
  private elementSwap = '';

  /** @returns container hosting the scroll given a selector or the related elementRef */
  private get currentScrollContainer() {
    return this.scrollContainerSelector
      ? this.el.nativeElement.querySelector(this.scrollContainerSelector)
      : this.el.nativeElement;
  }

  /** @returns the items list given a selector or the related elementRef children list */
  private get currentItemsList() {
    return this.listItemsSelector
      ? this.currentScrollContainer?.querySelectorAll(this.listItemsSelector)
      : this.el.nativeElement.children;
  }

  // === html event listeners === //
  private onScrollStartEventListener!: any;
  private onScrollEndEventListener!: any;
  // === Timeout listeners === //
  private checkListTimeoutListener!: NodeJS.Timeout;

  /**
   *
   * Virtual scroll directive needed dependencies
   *
   * @param {Renderer2} renderer Angular - Renderer2 in order to handle DOM actions
   * @param {ElementRef} el Angular - ElementRef class related element
   * @param {string} itemSize Angular - Attribute each list items fixed height
   * @param {string} scrollContainerSelector Angular - Attribute scroll container selector
   * @param {string} listItemsSelector Angular - Attribute list items selector
   */
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Attribute('itemSize') itemSize: string,
    @Attribute('scrollContainerSelector')
    private scrollContainerSelector: string,
    @Attribute('listItemsSelector') private listItemsSelector: string
  ) {
    this.currentItemSize = Number(itemSize);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkItemList']?.currentValue && this.checkItemList) {
      if (this.checkListTimeoutListener) {
        clearTimeout(this.checkListTimeoutListener);
      }
      this.setUpScrollListeners();
      this.checkListTimeoutListener = setTimeout(() => {
        // Get scroll container height
        this.parentContainerScrollHeight =
          this.currentScrollContainer.scrollHeight;
      }, 0);
    }
  }

  /**
   * Set up scroll listeners for the given scroll container
   */
  private setUpScrollListeners() {
    if (this.onScrollStartEventListener) {
      this.onScrollStartEventListener();
    }
    if (this.onScrollEndEventListener) {
      this.onScrollEndEventListener();
    }
    this.onScrollStartEventListener = this.renderer.listen(
      this.currentScrollContainer,
      'scroll',
      () => {
        console.log('scroll start');
      }
    );
    this.onScrollEndEventListener = this.renderer.listen(
      this.currentScrollContainer,
      'scrollend',
      () => {
        console.log('scroll end');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.checkListTimeoutListener) {
      clearTimeout(this.checkListTimeoutListener);
    }
    if (this.onScrollStartEventListener) {
      this.onScrollStartEventListener();
    }
    if (this.onScrollEndEventListener) {
      this.onScrollEndEventListener();
    }
  }
}
