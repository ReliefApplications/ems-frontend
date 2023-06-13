import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
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
import { Subject, takeUntil } from 'rxjs';
import { TabBodyHostDirective } from './directives/tab-body-host.directive';

/**
 * UI Tabs component
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
export class TabsComponent implements AfterContentInit, OnDestroy {
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

  @Output() openedTab = new EventEmitter<TabComponent>();

  @ViewChild(TabBodyHostDirective)
  tabBodyHost!: TabBodyHostDirective;

  triggerAnimation = false;
  destroy$ = new Subject<void>();

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
    } else {
      classes.push('border-b');
      classes.push('mb-4');
    }
    return classes;
  }

  ngAfterContentInit() {
    // Timeout will trigger change detection accordingly to avoid change cycle errors
    setTimeout(() => {
      // Initialize tab components
      this.tabs.forEach((tab, index) => {
        tab.variant = this.variant;
        tab.vertical = this.vertical;
        tab.index = index;
        tab.openTab.pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.showContent(tab);
        });
        if (index === this.selectedIndex) {
          this.showContent(tab);
        }
      });
    }, 0);
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
      // this.deleteContent();
      this.triggerAnimation = false;

      // Creates the content element thanks to the hidden html content of the tab component
      // Timeout so the animation has the time to render (elsewhere it can't cause delete then create is instantaneous)
      setTimeout(() => {
        this.triggerAnimation = true;
        this.openedTab.emit(tab);
        // this.createContent(tab);
      }, 100);
      // Emits the current selected index
      this.selectedIndexChange.emit(this.selectedIndex);
    }
  }

  /**
   * Update select state of all the tabs
   */
  public setSelectedTab() {
    this.tabs.forEach((tab, index) => {
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
    this.triggerAnimation = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
