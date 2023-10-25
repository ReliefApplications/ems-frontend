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
 * How many items can be rendered outside the scroll view
 */
const TOLERANCE_NUMBER_ITEMS = 4;

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
  private scrollAmount = 0;

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

  // === html event listeners === //
  private onScrollStartEventListener!: any;
  private onScrollEndEventListener!: any;
  // === Timeout listeners === //
  private checkListTimeoutListener!: NodeJS.Timeout;

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
      this.setUpScrollListeners();
      this.checkListTimeoutListener = setTimeout(() => {
        // Reset scrolling amount on change list
        this.scrollAmount = 0;
        // Save all the items for the virtual scroll for later use
        this.listItems = [...this.currentItemsList];
        // Get scroll container height
        this.parentContainerScrollHeight =
          this.currentScrollContainer.clientHeight;
        this.swapOutOfViewElements();
      }, 0);
    }
  }

  /**
   * Swap original list items outside that are outside the scroll view
   */
  swapOutOfViewElements() {
    let itemsHeightSum = 0;
    for (let index = 0; index < this.currentItemsList.length; index++) {
      // If current scroll container height + item tolerance outside view is reached, start swapping
      if (
        itemsHeightSum >=
        this.parentContainerScrollHeight +
          TOLERANCE_NUMBER_ITEMS * this.currentItemSize
      ) {
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
        if (
          this.currentScrollContainer.scrollTop >
          (TOLERANCE_NUMBER_ITEMS - 1) * this.currentItemSize
        ) {
          this.updateSwapItemsOnScreen();
        }
        console.log('scroll start');
      }
    );
    this.onScrollEndEventListener = this.renderer.listen(
      this.currentScrollContainer,
      'scrollend',
      () => {
        // Set the total scrolled amount value for the next scroll check
        this.scrollAmount = this.currentScrollContainer.scrollTop;
      }
    );
  }

  /**
   * Start swapping original items and swapping items on scroll event
   */
  private updateSwapItemsOnScreen() {
    const lastNoSwapItemIndex = this.getNoSwapElementIndex('last') + 1;
    // If the number of items displayed in the DOM list is bigger than the container view + item tolerance distance
    // then start swapping tail list items
    const firstNoSwapItemIndex =
      lastNoSwapItemIndex * this.currentItemSize >
      this.parentContainerScrollHeight +
        TOLERANCE_NUMBER_ITEMS * this.currentItemSize
        ? this.getNoSwapElementIndex('first')
        : null;
    const isScrollingDown =
      this.currentScrollContainer.scrollTop > this.scrollAmount;

    if (isScrollingDown) {
      this.updateListItemScrollDown(lastNoSwapItemIndex, firstNoSwapItemIndex);
    } else {
      this.updateListItemScrollUp(lastNoSwapItemIndex, firstNoSwapItemIndex);
    }
  }

  /**
   * Update list items outside the scroll view on scroll down from the given head and tail original items index
   *
   * @param {number} lastNoSwapItemIndex list tail index from where to start swapping
   * @param {number | null} firstNoSwapItemIndex list head swapping from where to start swapping
   */
  private updateListItemScrollDown(
    lastNoSwapItemIndex: number,
    firstNoSwapItemIndex: number | null
  ) {
    let scrolledHeight = 0;
    // If we have to stop swapping given the current scroll distance done
    const stopSwapingList = () =>
      scrolledHeight > this.currentScrollContainer.scrollTop ||
      this.currentScrollContainer.scrollTop - scrolledHeight <
        this.currentItemSize;
    // Save node references of original or swapping items for later removal
    const removedReferences: string[] = [];
    const removedSpanReferences: string[] = [];
    if (firstNoSwapItemIndex !== null) {
      // Update swap items in the top position of the list
      for (
        let index = firstNoSwapItemIndex;
        index < this.itemsListWithSwappers.length;
        index++
      ) {
        if (stopSwapingList()) {
          break;
        } else {
          // Create the swap element(empty row) to replace the original row with the data using the index as reference for swap
          this.elementSwap = this.createSwapElement(
            this.itemsListWithSwappers[index].dataset.kendoGridItemIndex
          );
          // Save that reference for later removal of the original row
          removedReferences.push(
            this.itemsListWithSwappers[index].dataset.kendoGridItemIndex
          );
          // Insert the empty row before the original row to remove
          this.renderer.insertBefore(
            this.itemListParentContainer,
            this.elementSwap,
            this.itemsListWithSwappers[index]
          );
          // Update the index from where to start in the bottom visible rows
          lastNoSwapItemIndex++;
          index++;
          // Update how much scroll height is done on swapping
          scrolledHeight += this.currentItemSize;
        }
      }
    }
    scrolledHeight = 0;
    // Update swap items in the bottom position of the list
    for (
      let index = lastNoSwapItemIndex;
      index < this.itemsListWithSwappers.length;
      index++
    ) {
      if (stopSwapingList()) {
        break;
      } else {
        // Get the swap element(empty row) reference to swap with the original item
        const swapReference =
          this.itemsListWithSwappers[index]['ui-swap-reference'];
        // Save that empty row reference for later removal
        removedSpanReferences.push(swapReference);
        // Find the original item to insert using the previously set reference
        const originalItem = this.listItems.find(
          (item) => swapReference === item.dataset.kendoGridItemIndex
        );
        // Insert the original row before the empty row to remove
        this.renderer.insertBefore(
          this.itemListParentContainer,
          originalItem,
          this.itemsListWithSwappers[index]
        );
        index++;
        // Update how much scroll height is done on swapping
        scrolledHeight += this.currentItemSize;
      }
    }
    // Remove all the nodes that have been swapped from the DOM using the previously saved references
    this.removeNodes(removedReferences, removedSpanReferences);
  }

  /**
   * Update list items outside the scroll view on scroll up from the given head and tail original items index
   *
   * @param {number} lastNoSwapItemIndex list tail index from where to start swapping
   * @param {number | null} firstNoSwapItemIndex list head swapping from where to start swapping
   */
  private updateListItemScrollUp(
    lastNoSwapItemIndex: number,
    firstNoSwapItemIndex: number | null
  ) {
    let scrolledHeight = 0;
    // If we have to stop swapping given the current scroll distance done
    const stopSwapingList = () =>
      scrolledHeight > this.currentScrollContainer.scrollTop ||
      this.currentScrollContainer.scrollTop - scrolledHeight <
        this.currentItemSize;
    // Save node references of original or swapping items for later removal
    const removedReferences: string[] = [];
    const removedSpanReferences: string[] = [];
    if (firstNoSwapItemIndex !== null) {
      // Update swap items in the top position of the list
      for (let index = firstNoSwapItemIndex; index >= 0; index--) {
        if (stopSwapingList()) {
          break;
        } else {
          // Get the swap element(empty row) reference to swap with the original item
          const swapReference =
            this.itemsListWithSwappers[index]['ui-swap-reference'];
          // Save that empty row reference for later removal
          removedSpanReferences.push(swapReference);
          // Find the original item to insert using the previously set reference
          const originalItem = this.listItems.find(
            (item) => swapReference === item.dataset.kendoGridItemIndex
          );
          // Insert the original row before the empty row to remove
          this.renderer.insertBefore(
            this.itemListParentContainer,
            originalItem,
            this.itemsListWithSwappers[index]
          );
          // Update how much scroll height is done on swapping
          scrolledHeight += this.currentItemSize;
        }
      }
    }
    scrolledHeight = 0;
    // Update swap items in the bottom position of the list
    for (let index = lastNoSwapItemIndex; index >= 0; index--) {
      if (stopSwapingList()) {
        break;
      } else {
        // Create the swap element(empty row) to replace the original row with the data using the index as reference for swap
        this.elementSwap = this.createSwapElement(
          this.itemsListWithSwappers[index].dataset.kendoGridItemIndex
        );
        // Save that reference for later removal of the original row
        removedReferences.push(
          this.itemsListWithSwappers[index].dataset.kendoGridItemIndex
        );
        // Insert the empty row before the original row to remove
        this.renderer.insertBefore(
          this.itemListParentContainer,
          this.elementSwap,
          this.itemsListWithSwappers[index]
        );
        // Update how much scroll height is done on swapping
        scrolledHeight += this.currentItemSize;
      }
    }
    // Remove all the nodes that have been swapped from the DOM using the previously saved references
    this.removeNodes(removedReferences, removedSpanReferences);
  }

  /**
   * Remove all given nodes from the DOM
   *
   * @param {string[]} removedReferences Node references of removed original items
   * @param {string[]} removedSpanReferences Node references of removed swap items
   */
  removeNodes(removedReferences: string[], removedSpanReferences: string[]) {
    this.itemsListWithSwappers.forEach((element: any) => {
      let toRemove = false;
      if (element.tagName.toLowerCase() !== 'span') {
        toRemove = removedReferences.includes(
          element.dataset.kendoGridItemIndex
        );
      } else {
        toRemove = removedSpanReferences.includes(element['ui-swap-reference']);
      }
      if (toRemove) {
        element.remove();
      }
    });
  }

  /**
   * Get the first element at the head or tail of the list that is not a swapping element
   *
   * @param {'first'|'last'} forElement Element from we want to extract index
   * @returns {number} First index from start or bottom where it's not a swapping element
   */
  private getNoSwapElementIndex(forElement: 'first' | 'last'): number {
    let elementIndex = 0;
    for (let index = 0; index < this.itemsListWithSwappers.length; index++) {
      if (forElement === 'first') {
        if (
          this.itemsListWithSwappers[index].tagName.toLowerCase() !== 'span'
        ) {
          elementIndex = index;
          break;
        }
      } else {
        if (
          this.itemsListWithSwappers[index].tagName.toLowerCase() !== 'span' &&
          this.itemsListWithSwappers[index + 1]?.tagName.toLowerCase() ===
            'span'
        ) {
          elementIndex = index;
          break;
        }
      }
    }
    return elementIndex;
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
