import { Dialog } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { DomPortal } from '@angular/cdk/portal';
import { TabsComponent as UiTabsComponent } from '@oort-front/ui';
import { WidgetComponent } from '../../widget/widget.component';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { cloneDeep } from 'lodash';

/**
 * Tabs widget component.
 */
@Component({
  selector: 'shared-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent
  extends BaseWidgetComponent
  implements AfterViewInit, OnChanges, OnDestroy, OnInit
{
  /** Widget settings */
  @Input() settings: any;
  /** Widget definition */
  @Input() widget: any;
  /** Editable widget */
  @Input() canUpdate = false;
  /** Should show padding */
  @Input() usePadding = true;
  /** Hides the inner grid scrollbar; set true when the widget auto-resizes to fit content */
  @Input() overflowHidden = false;
  /** Widget edit event */
  @Output() edit: EventEmitter<any> = new EventEmitter();
  /** Emits overflow in pixels (content height − visible height, negative when content is smaller) */
  @Output() contentHeightChange = new EventEmitter<number>();
  /** Reference to ui tab group */
  @ViewChild(UiTabsComponent)
  tabGroup?: UiTabsComponent;
  /** CDK portal. Allow to display part of the tab group element in another place */
  portal?: DomPortal;
  /** Selected tab index */
  selectedIndex = 0;
  /** Current tabs */
  tabs: any[] = [];
  /** Parent scroll position, restored on each tab change */
  public parentScroll = {
    scrollTop: 0,
    scrollLeft: 0,
  };
  /** ResizeObserver watching the active tab's nested grid content */
  private contentResizeObserver?: ResizeObserver;
  /** Elements currently watched by the ResizeObserver */
  private observedElements = new Set<Element>();
  /** Debounce timer for ResizeObserver emissions */
  private debounceTimer?: ReturnType<typeof setTimeout>;
  /** Timer deferring observer setup until tab content is rendered */
  private setupTimer?: ReturnType<typeof setTimeout>;

  /**
   * Tabs widget component.
   *
   * @param widgetComponent parent widget component ( optional )
   * @param dialog Dialog service
   * @param el Reference to component element
   */
  constructor(
    @Optional() public widgetComponent: WidgetComponent,
    private dialog: Dialog,
    private el: ElementRef
  ) {
    super();
  }

  ngOnInit() {
    this.tabs = cloneDeep(this.settings.tabs);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['settings']?.currentValue) {
      this.tabs = cloneDeep(changes['settings'].currentValue.tabs);
    }
    if (changes['overflowHidden']) {
      this.applyOverflowStyle();
    }
  }

  ngAfterViewInit(): void {
    /** Take part of the tab group element to display it in the header template */
    this.portal = new DomPortal(this.tabGroup?.tabList);
    this.setupContentObserver();
  }

  override ngOnDestroy(): void {
    clearTimeout(this.setupTimer);
    clearTimeout(this.debounceTimer);
    this.contentResizeObserver?.disconnect();
    super.ngOnDestroy();
  }

  /**
   * Open settings
   */
  async openSettings(): Promise<void> {
    if (this.widgetComponent) {
      const { EditWidgetModalComponent } = await import(
        '../../widget-grid/edit-widget-modal/edit-widget-modal.component'
      );
      const dialogRef = this.dialog.open(EditWidgetModalComponent, {
        disableClose: true,
        data: {
          widget: this.widget,
        },
      });
      dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if (res) {
          this.edit.emit({
            type: 'data',
            id: this.widgetComponent.id,
            options: res,
          });
        }
      });
    }
  }

  /**
   * Store previous scroll positions of parent app page container
   */
  onWillDetach() {
    const pageContainer = document.getElementById('appPageContainer');
    this.parentScroll.scrollLeft = pageContainer?.scrollLeft || 0;
    this.parentScroll.scrollTop = pageContainer?.scrollTop || 0;
  }

  /**
   * Restore previous scroll positions of parent app page container
   * Prevent app page container to incorrectly scroll when loading a new tab in tabs widget.
   */
  onDidAttach() {
    const pageContainer = document.getElementById('appPageContainer');
    if (pageContainer) {
      pageContainer.scrollTop = this.parentScroll.scrollTop;
      pageContainer.scrollLeft = this.parentScroll.scrollLeft;
    }
    // Newly attached tab content renders its own widget grid
    this.setupContentObserver();
  }

  /** @returns Nested widget grid element of the active tab */
  private get gridElement(): HTMLElement | null {
    return this.el.nativeElement.querySelector('gridster');
  }

  /**
   * Watches the active tab's nested grid so height changes of its content are
   * emitted to the parent widget component (which auto-resizes the widget).
   */
  private setupContentObserver(): void {
    clearTimeout(this.setupTimer);
    this.contentResizeObserver?.disconnect();
    this.contentResizeObserver = undefined;
    this.observedElements.clear();
    // Wait a tick so the tab content (nested widget grid) is rendered
    this.setupTimer = setTimeout(() => {
      const gridElement = this.gridElement;
      if (!gridElement) return;
      this.applyOverflowStyle();
      this.contentResizeObserver = new ResizeObserver(() => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.emitOverflow(), 300);
      });
      this.observe(gridElement);
    });
  }

  /**
   * Observe size changes of the given element.
   *
   * @param element Element to observe
   */
  private observe(element: Element): void {
    this.observedElements.add(element);
    this.contentResizeObserver?.observe(element);
  }

  /** Emits current content overflow, and watches grid items that appeared since last emission. */
  private emitOverflow(): void {
    const gridElement = this.gridElement;
    if (!gridElement || !this.contentResizeObserver) return;
    this.contentHeightChange.emit(this.measureOverflow(gridElement));
    // Widgets can render async: observe grid items not yet watched, so their
    // own growth (e.g. nested auto-resizing editor) re-triggers a measure
    gridElement
      .querySelectorAll(':scope > gridster-item')
      .forEach((item: Element) => {
        if (!this.observedElements.has(item)) {
          this.observe(item);
        }
      });
  }

  /**
   * Measure scroll overflow of the nested widget grid.
   *
   * @param gridElement Nested widget grid element of the active tab
   * @returns Signed overflow in pixels: positive when content overflows the
   * visible area, negative when there is unused space below the last widget.
   */
  private measureOverflow(gridElement: HTMLElement): number {
    const overflow = gridElement.scrollHeight - gridElement.clientHeight;
    if (overflow > 0) return overflow;
    // Content fits: measure slack below the bottom-most grid item, so the
    // parent widget can shrink back (e.g. after switching to a smaller tab)
    const gridRect = gridElement.getBoundingClientRect();
    let contentBottom = gridRect.top;
    gridElement
      .querySelectorAll(':scope > gridster-item')
      .forEach((item: Element) => {
        contentBottom = Math.max(
          contentBottom,
          item.getBoundingClientRect().bottom
        );
      });
    return Math.round(contentBottom - gridRect.bottom);
  }

  /** Toggles the nested grid scrollbar, hidden while the parent widget auto-resizes to fit content. */
  private applyOverflowStyle(): void {
    const gridElement = this.gridElement;
    if (gridElement) {
      gridElement.style.overflowY = this.overflowHidden ? 'hidden' : '';
    }
  }
}
