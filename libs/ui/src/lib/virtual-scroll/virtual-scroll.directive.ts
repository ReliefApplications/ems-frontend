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
  private firstViewTrigger = true;

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

  /** @returns all the swapper items */
  private get swapperItemsList() {
    return this.currentScrollContainer?.querySelectorAll('span.ui-swapper');
  }

  // === Event listeners === //
  private onScrollStartListener!: any;
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
      // Remove any previously added swappers
      this.swapperItemsList.forEach((element: any) => {
        element.remove();
      });
      this.checkListTimeoutListener = setTimeout(() => {
        this.currentScrollContainer.scrollTo(0, 0);
        // Get scroll container height
        this.parentContainerScrollHeight =
          this.currentScrollContainer.clientHeight;
        // If there was an observer active, disconnect it
        if (this.parentIntersectionObserver) {
          this.parentIntersectionObserver.disconnect();
        }
        // If there is an scroll, then add swapper elements to the DOM
        if (
          this.parentContainerScrollHeight <
          this.currentItemsList.length * this.currentItemSize
        ) {
          this.addSwapElementsIntoView();
        }
        this.firstViewTrigger = true;
        // Create intersection observer in order to check what elements enter/leave viewport
        this.parentIntersectionObserver = new IntersectionObserver(
          (entries) => {
            // Intersection observer triggers attached callback by default on DOM first load
            // In order to avoid any strange behavior, avoid this using this property
            if (this.firstViewTrigger) {
              return;
            }
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (entry.target.tagName.toLowerCase() === 'span') {
                  const originalItem = Array.from(
                    this.itemsListWithSwappers
                  ).find((element: any) => {
                    if (
                      (element as any).dataset?.kendoGridItemIndex ===
                      (entry.target as any)['ui-swap-reference']
                    ) {
                      return element;
                    }
                  });
                  this.renderer.addClass(entry.target, 'hidden');
                  this.renderer.removeClass(originalItem, 'hidden');
                }
              } else {
                if (entry.target.tagName.toLowerCase() !== 'span') {
                  const swapperItem = Array.from(
                    this.itemsListWithSwappers
                  ).find((element: any) => {
                    if (
                      (entry.target as any).dataset.kendoGridItemIndex ===
                      (element as any)['ui-swap-reference']
                    ) {
                      return element;
                    }
                  });
                  this.renderer.addClass(entry.target, 'hidden');
                  this.renderer.removeClass(swapperItem, 'hidden');
                }
              }
            });
          },
          {
            root: this.currentScrollContainer, // Table list
            threshold: 0.3, // set offset 0.3 means trigger if at least 30% of element in viewport
          }
        );
        if (this.onScrollStartListener) {
          this.onScrollStartListener();
        }
        this.onScrollStartListener = this.renderer.listen(
          this.currentScrollContainer,
          'scroll',
          () => {
            this.firstViewTrigger = false;
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
   * Attach a swap element next to the given element in order to display it outside of the view
   *
   * @param element Element to attache swap from the list
   * @param hideOriginalElement If given element is out of view by default or not
   */
  private swapElement(element: Element, hideOriginalElement = false) {
    // Create the swap element(empty row) to replace the original row with the data using the index as reference for swap
    const elementToSwap = this.createSwapElement(
      (element as any).dataset.kendoGridItemIndex,
      !hideOriginalElement
    );
    if (hideOriginalElement) {
      this.renderer.addClass(element, 'hidden');
    }
    // Insert the empty row before the original row to remove
    this.renderer.insertBefore(
      this.itemListParentContainer,
      elementToSwap,
      element
    );
  }

  /**
   * Add swap elements to the original list items that are outside the scroll view
   */
  addSwapElementsIntoView() {
    let itemsHeightSum = 0;
    let hideOriginalElement = false;
    for (let index = 0; index < this.currentItemsList.length; index++) {
      // If current scroll container height is reached, start hiding original items from view
      if (itemsHeightSum >= this.parentContainerScrollHeight) {
        hideOriginalElement = true;
      } else {
        itemsHeightSum += this.currentItemSize;
      }
      this.swapElement(this.currentItemsList[index], hideOriginalElement);
    }
  }

  /**
   * Create an empty row to swap with the original list item in order to keep the same scroll but less DOM stress
   *
   * @param {string} reference Reference data to later swap the created element with the original list item
   * @param {boolean} hideSwapElement If current swap element has to be hidden by default
   * @returns {HTMLSpanElement} the element for swapping
   */
  private createSwapElement(
    reference: string,
    hideSwapElement = true
  ): HTMLSpanElement {
    const swapElement = this.document.createElement('span');
    this.renderer.addClass(swapElement, 'ui-swapper');
    this.renderer.setStyle(swapElement, 'display', `block`);
    this.renderer.setStyle(swapElement, 'height', `${this.currentItemSize}px`);
    this.renderer.setStyle(swapElement, 'width', '100%');
    this.renderer.setProperty(swapElement, 'ui-swap-reference', reference);
    if (hideSwapElement) {
      this.renderer.addClass(swapElement, 'hidden');
    }
    return swapElement;
  }

  ngOnDestroy(): void {
    if (this.checkListTimeoutListener) {
      clearTimeout(this.checkListTimeoutListener);
    }
    if (this.parentIntersectionObserver) {
      this.parentIntersectionObserver.disconnect();
    }
    if (this.onScrollStartListener) {
      this.onScrollStartListener();
    }
  }
}
