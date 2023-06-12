import { CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ComponentFactoryResolver,
  Directive,
  Inject,
  ViewContainerRef,
  forwardRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TabsComponent } from '../tabs.component';
import { TabComponent } from '../components/tab/tab.component';

@Directive({
  selector: '[uiTabBodyHost]',
})
export class TabBodyHostDirective extends CdkPortalOutlet {
  destroy$: Subject<boolean> = new Subject<boolean>();

  private _openedTab?: TabComponent;

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
