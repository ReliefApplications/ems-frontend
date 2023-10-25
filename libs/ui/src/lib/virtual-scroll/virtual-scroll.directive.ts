import { DOCUMENT } from '@angular/common';
import {
  Attribute,
  Directive,
  ElementRef,
  Inject,
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
  private elementSwap!: HTMLSpanElement;
  private listItems: any[] = [];

  /** @returns parent node of the item list */
  private get itemListParentContainer() {
    return this.renderer.parentNode(this.currentItemsList[0]);
  }

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

  /** @returns the items list given a selector or the related elementRef children list */
  private get itemsListWithSwappers() {
    const fullSelector = `${this.listItemsSelector ?? '>*'}, span.ui-swapper`;
    return this.currentScrollContainer?.querySelectorAll(fullSelector);
  }

  // === Timeout listeners === //
  private checkListTimeoutListener!: NodeJS.Timeout;
  // === Intersection observer === //
  private parentIntersectionObserver!: IntersectionObserver;

  /**
   *
   * Virtual scroll directive needed dependencies
   *
   * @param {Document} document Angular - Document token in order to work with current document object
   * @param {Renderer2} renderer Angular - Renderer2 in order to handle DOM actions
   * @param {ElementRef} el Angular - ElementRef class related element
   * @param {string} itemSize Angular - Attribute each list items fixed height
   * @param {string} scrollContainerSelector Angular - Attribute scroll container selector
   * @param {string} listItemsSelector Angular - Attribute list items selector
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
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
      this.checkListTimeoutListener = setTimeout(() => {
        // // // Get scroll container height
        this.parentContainerScrollHeight =
          this.currentScrollContainer.clientHeight;
        // Save all the items for the virtual scroll for later use
        this.listItems = [...this.currentItemsList];
        // If there was an observer active, disconnect it
        if (this.parentIntersectionObserver) {
          this.parentIntersectionObserver.disconnect();
        }
        // Swap all items out of view by default
        this.swapOutOfViewElements();
        let firstView = true;
        // Create intersection observer in order to check what elements enter/leave viewport
        this.parentIntersectionObserver = new IntersectionObserver(
          (entries) => {
            if (firstView) {
              firstView = false;
              return;
            }
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (entry.target.tagName.toLowerCase() === 'span') {
                  // Get the swap element(empty row) reference to swap with the original item
                  const swapReference = (entry.target as any)[
                    'ui-swap-reference'
                  ];
                  // Find the original item to insert using the previously set reference
                  const originalItem = this.listItems.find(
                    (item) => swapReference === item.dataset.kendoGridItemIndex
                  );
                  // Observe new item to trigger swapping
                  this.parentIntersectionObserver.observe(originalItem);
                  this.renderer.insertBefore(
                    this.itemListParentContainer,
                    originalItem,
                    entry.target
                  );
                  entry.target.remove();
                }
              } else {
                if (entry.target.tagName.toLowerCase() !== 'span') {
                  // Create the swap element(empty row) to replace the original row with the data using the index as reference for swap
                  this.elementSwap = this.createSwapElement(
                    (entry.target as any).dataset.kendoGridItemIndex
                  );
                  // Observe new item to trigger swapping
                  this.parentIntersectionObserver.observe(this.elementSwap);
                  // Insert the empty row before the original row to remove
                  this.renderer.insertBefore(
                    this.itemListParentContainer,
                    this.elementSwap,
                    entry.target
                  );
                  entry.target.remove();
                }
              }
            });
          },
          {
            root: this.currentScrollContainer, // Table list
            threshold: 0.3, // set offset 0.3 means trigger if at least 30% of element in viewport
          }
        );
        // Observe all current items
        this.itemsListWithSwappers.forEach((element: any) => {
          this.parentIntersectionObserver.observe(element);
        });
      }, 0);
    }
  }

  /**
   * Swap original list items outside that are outside the scroll view
   */
  swapOutOfViewElements() {
    let itemsHeightSum = 0;
    for (let index = 0; index < this.currentItemsList.length; index++) {
      // If current scroll container height is reached, start swapping
      if (itemsHeightSum >= this.parentContainerScrollHeight) {
        this.elementSwap = this.createSwapElement(
          this.currentItemsList[index].dataset.kendoGridItemIndex
        );
        this.renderer.removeChild(
          this.itemListParentContainer,
          this.currentItemsList[index]
        );
        this.renderer.appendChild(
          this.itemListParentContainer,
          this.elementSwap
        );
      } else {
        itemsHeightSum += this.currentItemSize;
      }
    }
  }

  /**
   * Create an empty row to swap with the original list item in order to keep the same scroll but less DOM stress
   *
   * @param reference Reference data to later swap the created element with the original list item
   * @returns {HTMLSpanElement} the element for swapping
   */
  private createSwapElement(reference: string): HTMLSpanElement {
    const swapElement = this.document.createElement('span');
    this.renderer.addClass(swapElement, 'ui-swapper');
    this.renderer.setStyle(swapElement, 'display', `block`);
    this.renderer.setStyle(swapElement, 'height', `${this.currentItemSize}px`);
    this.renderer.setStyle(swapElement, 'width', '100%');
    this.renderer.setProperty(swapElement, 'ui-swap-reference', reference);
    return swapElement;
  }

  ngOnDestroy(): void {
    if (this.checkListTimeoutListener) {
      clearTimeout(this.checkListTimeoutListener);
    }
    if (this.parentIntersectionObserver) {
      this.parentIntersectionObserver.disconnect();
    }
  }
}
