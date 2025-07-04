import { CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ComponentFactoryResolver,
  DestroyRef,
  Directive,
  EventEmitter,
  inject,
  Inject,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { TabComponent } from '../components/tab/tab.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * UI Tab body host directive.
 * Used to render content of tabs.
 */
@Directive({
  selector: '[uiTabBodyHost]',
})
export class TabBodyHostDirective extends CdkPortalOutlet implements OnInit {
  /** Current opened tab */
  private _openedTab?: TabComponent;
  /**
   * Current opened tab setter
   */
  @Input() openedTab!: EventEmitter<TabComponent>;
  /** Will detach portal */
  @Output() willDetach = new EventEmitter<void>();
  /** Did portal attach */
  @Output() didAttach = new EventEmitter<void>();
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * UI Tab body host directive.
   * Used to render content of tabs.
   *
   * @param componentFactoryResolver Angular component factory resolver ( deprecated )
   * @param viewContainerRef Angular view container reference
   * @param _document document
   */
  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) _document: any
  ) {
    super(componentFactoryResolver, viewContainerRef, _document);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.openedTab
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tab: TabComponent) => {
        if (tab !== this._openedTab && this.hasAttached()) {
          this.willDetach.emit();
          this.detach();
        }
        if (!this.hasAttached()) {
          this.attach(tab.content);
          this.didAttach.emit();
        }
      });
  }
}
