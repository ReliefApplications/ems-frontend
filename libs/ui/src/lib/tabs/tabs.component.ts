import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Variant } from '../types/variant';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { TabComponent } from './components/tab/tab.component';
import { Subject, takeUntil, startWith } from 'rxjs';
import { TabBodyHostDirective } from './directives/tab-body-host.directive';

/**
 * UI Tabs component
 * Tabs are used to split content between multiple sections. Tabs can be either horizontal or vertical.
 */
@Component({
  selector: 'ui-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  animations: [
    trigger('tabContentDisplay', [
      // Initial state of content when loading component is visible(no animation)
      state('initial', style({ opacity: 1, transform: 'translateX(0%)' })),
      // Load content state is hidden when we load another tab that is not the default one
      state(
        'loadContent',
        style({ opacity: 0.1, transform: 'translateX(100%)' })
      ),
      // From the load content to content-in we would trigger the animation that loads the content in from bottom to top
      transition('loadContent => initial', [animate('.3s ease-in-out')]),
      transition('initial => loadContent', [animate('.001s ease-in-out')]),
    ]),
  ],
})
export class TabsComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ContentChildren(TabComponent, { descendants: true })
  tabs!: QueryList<TabComponent>;

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
  @Input() variant: Variant = 'default';
  /**
   * Output emitted whenever a new tab is clicked, gives the index of the new tab
   */
  @Output() selectedIndexChange = new EventEmitter<number>();
  /** Event emitter for when a tab is opened. */
  @Output() openedTab = new EventEmitter<TabComponent>();
  /** Reference to the TabBodyHostDirective. */
  @ViewChild(TabBodyHostDirective)
  tabBodyHost!: TabBodyHostDirective;

  previousTabsLength = 0;
  triggerAnimation = false;
  hideScroll = true;
  destroy$ = new Subject<void>();
  reorder$ = new Subject<void>();
  contentMaxWidth = 'none';
  private triggerAnimationTimeoutListener!: NodeJS.Timeout;

  /**
   * Change the tab content max-width depending on windows size.
   *
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateTabContainerMaxWidth();
  }

  /**
   * Ui Sidenav constructor
   *
   * @param {ElementRef} el HTML attached to this class instance
   * @param {ChangeDetectorRef} cdr ChangeDetectorRef
   */
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  /** @returns general resolved position classes for navigation tabs*/
  get resolveTabPositionClasses(): string[] {
    const classes = [];
    if (this.vertical) {
      classes.push('col-span-3');
      classes.push('flex-col');
      classes.push('h-full');
      classes.push('mr-4');
    } else {
      classes.push('border-b');
      classes.push('mb-4');
      classes.push('overflow-x-auto');
    }
    return classes;
  }

  ngAfterViewInit() {
    // This ensures that the subscription logic is executed for both existing and new tab elements
    this.tabs.changes
      .pipe(startWith(this.tabs), takeUntil(this.destroy$))
      .subscribe((tabs: QueryList<TabComponent>) => {
        this.cdr.detectChanges();
        if (tabs.length !== this.previousTabsLength) {
          this.reorder$.next();
          this.previousTabsLength = tabs.length;
          this.subscribeToOpenTabEvents();
        }
      });
    this.updateTabContainerMaxWidth();
  }

  /**
   * If vertical tabs display, content on the left should have a max-width set dynamically
   * in order to correctly trigger any x axis overflow
   */
  private updateTabContainerMaxWidth() {
    if (this.vertical) {
      const tabsContainerFullWidth = this.getTabsContainerFullWidth();
      this.contentMaxWidth = `calc(100% - ${tabsContainerFullWidth}px)`;
    }
  }

  /**
   * Returns the element width of the tabs container
   *
   * @returns Element width containing tabs including also margin values
   */
  private getTabsContainerFullWidth(): number {
    const tabsContainer: Element =
      this.el.nativeElement.querySelector('[id^="tabs"]');
    const styles = window.getComputedStyle(tabsContainer);
    const leftMargin = styles.getPropertyValue('margin-left');
    const rightMargin = styles.getPropertyValue('margin-right');
    const leftMarginNumber = Number(leftMargin.match(/\d+/)) ?? 0;
    const rightMarginNumber = Number(rightMargin.match(/\d+/)) ?? 0;
    // Return element width plus any other margin values attached to it
    return tabsContainer.clientWidth + leftMarginNumber + rightMarginNumber;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.hideScroll = false;
    if (changes['selectedIndex']) {
      this.setSelectedTab();
    }
  }

  /**
   * Show the content linked to the tab clicked + manages classes so the good tab is selected in design
   *
   * @param tab tab to display
   */
  showContent(tab: TabComponent) {
    if (tab.index !== this.selectedIndex || !this.tabBodyHost.hasAttached()) {
      this.selectedIndex = tab.index;
      this.setSelectedTab();

      // Clean up previous displayed content
      this.triggerAnimation = false;

      // Creates the content element thanks to the hidden html content of the tab component
      // Timeout so the animation has the time to render (elsewhere it can't cause delete then create is instantaneous)
      if (this.triggerAnimationTimeoutListener) {
        clearTimeout(this.triggerAnimationTimeoutListener);
      }
      this.triggerAnimationTimeoutListener = setTimeout(() => {
        this.triggerAnimation = true;
        this.openedTab.emit(tab);
      }, 100);
      // Emits the current selected index
      this.selectedIndexChange.emit(this.selectedIndex);
    }
  }

  /**
   * Update select state of all the tabs
   */
  public setSelectedTab() {
    this.tabs?.forEach((tab) => {
      if (tab.index === this.selectedIndex) {
        tab.selected = true;
      } else {
        tab.selected = false;
      }
    });
  }

  /**
   * Gets all the tabs, initialize them and listen to the openTab event
   */
  private subscribeToOpenTabEvents(): void {
    this.tabs?.forEach((tab, index) => {
      tab.variant = this.variant;
      tab.vertical = this.vertical;
      tab.index = index;
      tab.openTab
        .pipe(takeUntil(this.reorder$), takeUntil(this.destroy$))
        .subscribe(() => {
          this.showContent(tab);
          this.selectedIndex = index;
        });
    });
    // To avoid that we select all tabs by default
    this.tabs?.forEach((tab) => {
      if (tab.index === this.selectedIndex) {
        this.showContent(tab);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.triggerAnimationTimeoutListener) {
      clearTimeout(this.triggerAnimationTimeoutListener);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
