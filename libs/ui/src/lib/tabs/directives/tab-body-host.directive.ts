import { CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TabComponent } from '../components/tab/tab.component';

/**
 * UI Tab body host directive.
 * Used to render content of tabs.
 */
@Directive({
  selector: '[uiTabBodyHost]',
})
export class TabBodyHostDirective
  extends CdkPortalOutlet
  implements OnInit, OnDestroy
{
  /** Destroy subject */
  destroy$: Subject<boolean> = new Subject<boolean>();
  /** Current opened tab */
  private _openedTab?: TabComponent;
  /**
   * Current opened tab setter
   */
  @Input() openedTab!: EventEmitter<TabComponent>;

  /**
   * UI Tab body host directive.
   * Used to render content of tabs.
   *
   * @param componentFactoryResolver Angular component factory resolver ( deprecated )
   * @param viewContainerRef Angular view container reference
   * @param _document document
   * @param cdr ChangeDetectorRef
   */
  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) _document: any,
    private cdr: ChangeDetectorRef
  ) {
    super(componentFactoryResolver, viewContainerRef, _document);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.openedTab
      .pipe(takeUntil(this.destroy$))
      .subscribe((tab: TabComponent) => {
        if (tab !== this._openedTab && this.hasAttached()) {
          this.detach();
        }
        if (!this.hasAttached()) {
          this.attach(tab.content);
        }
        this.cdr.detectChanges();
      });
  }

  /**
   * Emit Destroy event, and unsubscribe to destroy
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
