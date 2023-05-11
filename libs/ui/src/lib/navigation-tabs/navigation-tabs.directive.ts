import {
  Directive,
  Renderer2,
  Input,
  HostListener,
  Output,
  EventEmitter,
  AfterViewInit,
  QueryList,
  ElementRef,
} from '@angular/core';
import { Variant } from '../shared/variant.enum';
import { NavigationTabsComponent } from './navigation-tabs.component';
import { TabComponent } from '../tab/tab.component';

/**
 * Directive that manages the behavior of a navigation tab
 */
@Directive({
  selector: '[uiNavigationTabs]',
})
export class NavigationTabsDirective implements AfterViewInit {
  /**
   * Index of the default selected tab
   */
  @Input() selectedIndex = 0;
  /**
   * True if the navigation tab is to be vertical, false otherwise
   */
  @Input() vertical = false;
  /**
   * True if the navigation tab is to be vertical, false otherwise
   */
  @Input() variant = Variant.DEFAULT;
  /**
   * Output emitted whenever a new tab is clicked, gives the index of the new tab
   */
  @Output() selectedIndexChange = new EventEmitter<number>();

  // Content that is to be displayed
  private content: any;
  private currentTabs: any[] = [];
  private contentContainer!: any;
  // Default classes to render content
  private classes = [
    'transition',
    'ease-in-out',
    'delay-150',
    'duration-300',
    'block',
    'py-4',
  ] as const;

  /**
   * Get tabs
   *
   * @returns all the options that are not parent group
   */
  getTabsList = () =>
    this.navigationTabsComponent.tabs as QueryList<TabComponent>;

  /**
   * Function that listen for the user's mouse to click the element where the directive is placed
   *
   * @param event event emitted by click
   */
  @HostListener('click', ['$event'])
  onClick(event: any) {
    // If the target of the event is a button of a tab, launch the content show
    if (event.target.id === 'buttonTab') {
      this.showContent(event.target);
      // Avoid double display by preventing event propagation to parent elements
      event.stopPropagation();
    }
  }

  /**
   * Constructor of the directive
   *
   * @param el Directive host element
   * @param renderer Angular renderer to work with DOM
   * @param navigationTabsComponent get component linked to the directive
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private navigationTabsComponent: NavigationTabsComponent
  ) {
    if (
      !navigationTabsComponent ||
      !(navigationTabsComponent instanceof NavigationTabsComponent)
    ) {
      throw new Error(
        'Directive cannot be applied to an element other than a navigation-tabs'
      );
    }
  }

  ngAfterViewInit() {
    // Initialize tab components
    this.getTabsList().forEach((tab, index) => {
      tab.variant = this.variant;
      tab.vertical = this.vertical;
      if (index === this.selectedIndex) {
        tab.selected = true;
      }
    });

    // Store current tabs
    this.currentTabs = this.el.nativeElement.querySelector('#tabs').children;
    // Store current tabs content wrapper
    this.contentContainer =
      this.el.nativeElement.querySelector('#contentWrapper');

    this.initializeContentWrapper();

    // Launches the content show and class modification function for the selectedIndex tab
    const initialTabButton = this.getTabsList().get(this.selectedIndex)?.button
      .nativeElement;
    if (initialTabButton?.id === 'buttonTab') {
      this.showContent(initialTabButton, true);
    }
  }

  /**
   * Creates the html element displaying the selected tab content
   */
  private initializeContentWrapper() {
    // Create content element
    this.content = this.renderer.createElement('div');
    for (const cl of this.classes) {
      this.renderer.addClass(this.content, cl);
    }
    if (this.vertical) {
      this.renderer.addClass(this.content, 'col-span-5');
      this.renderer.addClass(this.content, 'px-4');
    }
  }
  /**
   * Show the content linked to the tab clicked + manages classes so the good tab is selected in design
   *
   * @param target dom element clicked
   * @param firstLoad if is first loaded content we won't check selected index change
   */
  showContent(target: any, firstLoad: boolean = false) {
    const currentUiTabSelected = target.parentElement.parentElement;
    let selectedIndex = 0;
    for (const tab of this.currentTabs) {
      if (tab.isSameNode(currentUiTabSelected)) {
        selectedIndex = Array.prototype.indexOf.call(this.currentTabs, tab);
        break;
      }
    }
    // If same tab selected, don't trigger any action
    if (!firstLoad && this.selectedIndex === selectedIndex) {
      return;
    }
    this.selectedIndex = selectedIndex;

    this.setSelectedTab();

    // Clean up previous displayed content
    this.deleteContent();

    // Creates the content element thanks to the hidden html content of the tab component
    // Timeout so the animation has the time to render (elsewhere it can't cause delete then create is instantaneous)
    setTimeout(() => {
      this.createContent(target);
    }, 100);
    // Emits the current selected index
    this.selectedIndexChange.emit(selectedIndex);
  }

  /**
   * Update select state of all the tabs
   */
  private setSelectedTab() {
    this.getTabsList().forEach((tab, index) => {
      if (index === this.selectedIndex) {
        tab.selected = true;
      } else {
        tab.selected = false;
      }
    });
  }

  /**
   * Delete content displayed currently
   */
  deleteContent() {
    this.navigationTabsComponent.triggerAnimation = false;
    if (this.content) {
      this.renderer.removeChild(this.contentContainer, this.content);
    }
  }

  /**
   * Creates the content element thanks to the hidden html content of the tab component targeted
   *
   * @param target dom element clicked
   */
  createContent(target: any) {
    this.navigationTabsComponent.triggerAnimation = true;
    this.content.innerHTML =
      target.parentElement.querySelector('#content').innerHTML;
    // Actually add content to the wrapping div of the navigation tab content
    this.renderer.appendChild(this.contentContainer, this.content);
  }
}
