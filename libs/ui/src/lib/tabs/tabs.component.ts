import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
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
  /**
   * List of tabs
   */
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
  /** Will detach portal */
  @Output() willDetach = new EventEmitter<void>();
  /** Did portal attach */
  @Output() didAttach = new EventEmitter<void>();
  /** Reference to the TabBodyHostDirective. */
  @ViewChild(TabBodyHostDirective)
  tabBodyHost!: TabBodyHostDirective;
  /** Reference to tab list element */
  @ViewChild('tabList')
  tabList!: ElementRef<any>;

  /** Previous tabs length */
  previousTabsLength = 0;
  /** Trigger animation */
  triggerAnimation = false;
  /** Destroy subject */
  destroy$ = new Subject<void>();
  /** Reorder subject */
  reorder$ = new Subject<void>();
  /** Timeout to show content */
  private showContentTimeoutListener!: NodeJS.Timeout;

  /**
   * Ui Sidenav constructor
   *
   * @param cdr ChangeDetectorRef
   */
  constructor(private cdr: ChangeDetectorRef) {}

  /** @returns general resolved position classes for navigation tabs*/
  get resolveTabPositionClasses(): string[] {
    const classes = [];
    if (this.vertical) {
      classes.push('col-span-3');
      classes.push('flex-col');
      classes.push('h-full');
      classes.push('mr-4');
      classes.push('sticky');
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
        this.reorder$.next();
        this.previousTabsLength = tabs.length;
        this.subscribeToOpenTabEvents();
        this.setSelectedTab();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndex']) {
      this.setSelectedTab();
      const selectedTab = this.tabs?.find((tab) => {
        return tab.selected;
      });
      if (selectedTab) {
        this.showContent(selectedTab);
      }
    }
  }

  /**
   * Show the content linked to the tab clicked + manages classes so the good tab is selected in design
   *
   * @param tab tab to display
   */
  showContent(tab: TabComponent) {
    this.selectedIndex = tab.index;
    this.setSelectedTab();

    // Clean up previous displayed content
    this.triggerAnimation = false;

    // Creates the content element thanks to the hidden html content of the tab component
    // Timeout so the animation has the time to render (elsewhere it can't cause delete then create is instantaneous)
    if (this.showContentTimeoutListener) {
      clearTimeout(this.showContentTimeoutListener);
    }
    this.showContentTimeoutListener = setTimeout(() => {
      this.triggerAnimation = true;
      this.openedTab?.emit(tab);
    }, 100);
    // Emits the current selected index
    this.selectedIndexChange.emit(this.selectedIndex);
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
          if (
            tab.index !== this.selectedIndex ||
            !this.tabBodyHost.hasAttached()
          ) {
            this.showContent(tab);
          }
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
    if (this.showContentTimeoutListener) {
      clearTimeout(this.showContentTimeoutListener);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
