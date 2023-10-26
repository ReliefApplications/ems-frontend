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
import { get } from 'lodash';

/**
 * Virtual scroll directive
 */
@Directive({
  selector: '[uiVirtualScroll]',
  standalone: true,
})
export class VirtualScrollDirective implements OnChanges, OnDestroy {
  @Input() checkItemList = false;
  private parentContainerScrollSize = 0;
  private currentItemSize = 50;
  private stopIntersectionCallback = true;
  private swapTag: string = 'div';
  private currentVerticalScroll = 0;
  private currentHorizontalScroll = 0;

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
    const fullSelector = `${this.listItemsSelector ?? '>*'}, ${
      this.swapTag
    }.ui-swapper`;
    return this.currentScrollContainer?.querySelectorAll(fullSelector);
  }

  /** @returns all the swapper items */
  private get swapperItemsList() {
    return this.currentScrollContainer?.querySelectorAll(
      `${this.swapTag}.ui-swapper`
    );
  }

  private sizeToCheck = (element: any) => {
    return this.currentItemSize
      ? this.currentItemSize
      : this.scrollDirection === 'vertical'
      ? element.clientHeight
      : element.clientWidth;
  };

  private containsScrollbar = () => {
    if (this.scrollDirection === 'vertical') {
      if (
        this.currentScrollContainer.clientHeight <
        this.currentScrollContainer.scrollHeight
      ) {
        return true;
      }
    } else if (this.scrollDirection === 'horizontal') {
      if (
        this.currentScrollContainer.clientWidth <
        this.currentScrollContainer.scrollWidth
      ) {
        return true;
      }
    }

    return false;
  };
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
   * @param {string} itemSize Angular - Attribute each list items fixed size
   * @param {string} scrollContainerSelector Angular - Attribute scroll container selector
   * @param {string} listItemsSelector Angular - Attribute list items selector
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private el: ElementRef,
    @Attribute('itemSize') itemSize: string,
    @Attribute('referencePropertyPath') private referencePropertyPath: string,
    @Attribute('scrollContainerSelector')
    private scrollContainerSelector: string,
    @Attribute('listItemsSelector') private listItemsSelector: string,
    @Attribute('scrollDirection')
    private scrollDirection: 'horizontal' | 'vertical'
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
        // Get scroll container size to check
        this.parentContainerScrollSize =
          this.scrollDirection === 'vertical'
            ? this.currentScrollContainer.clientHeight
            : this.currentScrollContainer.clientWidth;
        // If there was an observer active, disconnect it
        if (this.parentIntersectionObserver) {
          this.parentIntersectionObserver.disconnect();
        }
        if (!this.referencePropertyPath) {
          this.referencePropertyPath = 'ui-swap-reference';
          this.currentItemsList.forEach((element: any, index: number) => {
            this.renderer.setProperty(
              element,
              this.referencePropertyPath,
              index
            );
          });
        }
        // If there is an scroll, then add swapper elements to the DOM
        if (this.containsScrollbar()) {
          this.addSwapElementsIntoView();
        }
        this.stopIntersectionCallback = true;
        // Create intersection observer in order to check what elements enter/leave viewport
        this.parentIntersectionObserver = new IntersectionObserver(
          (entries) => {
            // Intersection observer triggers attached callback by default on DOM first load
            // In order to avoid any strange behavior, avoid this using this property
            if (this.stopIntersectionCallback) {
              return;
            }
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (!entry.target.children.length) {
                  const originalItem = Array.from(
                    this.itemsListWithSwappers
                  ).find((element: any) => {
                    if (
                      get(element, this.referencePropertyPath) ===
                      (entry.target as any)['ui-swap-reference']
                    ) {
                      return element;
                    }
                  });
                  if (originalItem) {
                    const clone = (originalItem as any).cloneNode(true);
                    this.renderer.removeClass(clone, 'hidden');
                    this.renderer.removeClass(clone, 'ui-swapper');
                    this.renderer.appendChild(entry.target, clone);
                  }
                }
                // if (entry.target.tagName.toLowerCase() === this.swapTag) {
                //   const originalItem = Array.from(
                //     this.itemsListWithSwappers
                //   ).find((element: any) => {
                //     if (
                //       get(element, this.referencePropertyPath) ===
                //       (entry.target as any)['ui-swap-reference']
                //     ) {
                //       return element;
                //     }
                //   });
                //   this.renderer.addClass(entry.target, 'hidden');
                //   this.renderer.removeClass(originalItem, 'hidden');
                // }
              } else {
                if (entry.target.children.length) {
                  entry.target.children[0]?.remove();
                }
                //   if (entry.target.tagName.toLowerCase() !== this.swapTag) {
                //     const swapperItem = Array.from(
                //       this.itemsListWithSwappers
                //     ).find((element: any) => {
                //       if (
                //         get(entry.target, this.referencePropertyPath) ===
                //         (element as any)['ui-swap-reference']
                //       ) {
                //         return element;
                //       }
                //     });
                //     this.renderer.addClass(entry.target, 'hidden');
                //     this.renderer.removeClass(swapperItem, 'hidden');
                //   }
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
            if (this.scrollDirection === 'vertical') {
              if (
                this.currentHorizontalScroll !==
                this.currentScrollContainer.scrollLeft
              ) {
                this.stopIntersectionCallback = true;
                this.currentHorizontalScroll =
                  this.currentScrollContainer.scrollLeft;
              } else {
                this.stopIntersectionCallback = false;
              }
            } else if (this.scrollDirection === 'horizontal') {
              if (
                this.currentVerticalScroll !==
                this.currentScrollContainer.scrollTop
              ) {
                this.stopIntersectionCallback = true;
                this.currentVerticalScroll =
                  this.currentScrollContainer.scrollTop;
              } else {
                this.stopIntersectionCallback = false;
              }
            }
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
  private swapElement(
    element: Element,
    referenceIdentifier: string,
    hideOriginalElement = false
  ) {
    // Create the swap element(empty row) to replace the original row with the data using the index as reference for swap
    const elementToSwap = this.createSwapElement(
      referenceIdentifier,
      !hideOriginalElement
    );
    if (elementToSwap) {
      this.renderer.addClass(elementToSwap, 'hidden');
      if (hideOriginalElement) {
        element.children[0].remove();
      }
      // Insert the empty row before the original row to remove
      this.renderer.insertBefore(
        this.renderer.parentNode(element),
        elementToSwap,
        element
      );
    }
  }

  /**
   * Add swap elements to the original list items that are outside the scroll view
   */
  addSwapElementsIntoView() {
    let itemSizeSum = 0;
    let hideOriginalElement = false;
    const colNumber = Array.from(
      this.currentScrollContainer.querySelectorAll('col')
    ).length;
    // this.renderer.setProperty(this.currentItemsList, 'ui-swap-avoid', true);
    for (let index = 1; index < this.currentItemsList.length; index++) {
      if (index % colNumber === 0 || (index + 1) % colNumber === 0) {
        itemSizeSum = 0;
        hideOriginalElement = false;
        continue;
      }
      // If current scroll container scroll size is reached, start hiding original items from view
      if (itemSizeSum >= this.parentContainerScrollSize) {
        hideOriginalElement = true;
      } else {
        itemSizeSum += this.sizeToCheck(this.currentItemsList[index]);
      }
      this.swapElement(
        this.currentItemsList[index],
        get(this.currentItemsList[index], this.referencePropertyPath),
        hideOriginalElement
      );
    }
  }

  /**
   * Create an empty row to swap with the original list item in order to keep the same scroll but less DOM stress
   *
   * @param {string} reference Reference data to later swap the created element with the original list item
   * @param {boolean} hideSwapElement If current swap element has to be hidden by default
   * @returns {HTMLElement} the element for swapping
   */
  private createSwapElement(reference: string, hideSwapElement = true): any {
    // const swapElement = this.document.createElement(this.swapTag);
    // this.renderer.addClass(swapElement, 'ui-swapper');
    // if (this.scrollDirection === 'vertical') {
    //   this.renderer.setStyle(swapElement, 'display', `block`);
    // } else if (this.scrollDirection === 'horizontal') {
    //   this.renderer.setStyle(swapElement, 'display', `inline-block`);
    // }
    let elementSize = this.currentItemSize;
    if (!elementSize) {
      const originalItem = Array.from(this.currentItemsList).find(
        (element: any, index: number) =>
          get(element, this.referencePropertyPath) === reference
      ) as any;
      const clone = originalItem?.children[0]?.cloneNode(true);
      if (clone) {
        this.renderer.setProperty(clone, 'ui-swap-reference', reference);
        this.renderer.addClass(clone, 'ui-swapper');
        return clone;
      }
      return null;
      // elementSize =
      //   this.scrollDirection === 'vertical'
      //     ? originalItem?.clientHeight
      //     : originalItem?.clientWidth;
    }
    // if (this.scrollDirection === 'vertical') {
    //   this.renderer.setStyle(swapElement, 'width', '100%');
    //   this.renderer.setStyle(swapElement, 'height', `${elementSize}px`);
    // } else {
    //   this.renderer.setStyle(swapElement, 'width', `${elementSize}px`);
    //   this.renderer.setStyle(swapElement, 'height', '46px');
    // }

    // if (hideSwapElement) {
    //   this.renderer.addClass(swapElement, 'hidden');
    // }
    // return swapElement;
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
