import { CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ComponentFactoryResolver,
  Directive,
  Inject,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  forwardRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TabsComponent } from '../tabs.component';
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
  destroy$: Subject<boolean> = new Subject<boolean>();

  private _openedTab?: TabComponent;

  /**
   * UI Tab body host directive.
   * Used to render content of tabs.
   *
   * @param componentFactoryResolver Angular component factory resolver ( deprecated )
   * @param viewContainerRef Angular view container reference
   * @param _host parent tabs component
   * @param _document document
   */
  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    @Inject(forwardRef(() => TabsComponent)) private _host: TabsComponent,
    @Inject(DOCUMENT) _document: any
  ) {
    super(componentFactoryResolver, viewContainerRef, _document);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this._host.openedTab
      .pipe(takeUntil(this.destroy$))
      .subscribe((tab: TabComponent) => {
        if (tab !== this._openedTab && this.hasAttached()) {
          this.detach();
        }
        if (!this.hasAttached()) {
          this.attach(tab.content);
        }
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
