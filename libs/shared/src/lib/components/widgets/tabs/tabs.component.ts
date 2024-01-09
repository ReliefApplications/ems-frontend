import { Dialog } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { DomPortal } from '@angular/cdk/portal';
import { TabsComponent as UiTabsComponent } from '@oort-front/ui';
import { WidgetComponent } from '../../widget/widget.component';
import { ResizeObservable } from '../../../utils/rxjs/resize-observable.util';

/**
 * Tabs widget component.
 */
@Component({
  selector: 'shared-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent
  extends UnsubscribeComponent
  implements AfterViewInit, OnInit
{
  /** Widget settings */
  @Input() settings: any;
  /** Widget definition */
  @Input() widget: any;
  /** Editable widget */
  @Input() canUpdate = false;
  /** Should show padding */
  @Input() usePadding = true;
  /** Widget edit event */
  @Output() edit: EventEmitter<any> = new EventEmitter();
  /** Header template reference */
  @ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  /** Reference to ui tab group */
  @ViewChild(UiTabsComponent)
  tabGroup?: UiTabsComponent;
  /** CDK portal. Allow to display part of the tab group element in another place */
  portal?: DomPortal;
  /** Selected tab index */
  selectedIndex = 0;
  /** component size */
  size: any = {};

  /**
   * Tabs widget component.
   *
   * @param widgetComponent parent widget component ( optional )
   * @param dialog Dialog service
   * @param dashboardService Shared dashboard service
   * @param _host host element ref
   */
  constructor(
    @Optional() public widgetComponent: WidgetComponent,
    private dialog: Dialog,
    private dashboardService: DashboardService,
    private _host: ElementRef
  ) {
    super();
  }

  ngOnInit(): void {
    new ResizeObservable(this._host.nativeElement)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setTabSize();
      });
  }

  ngAfterViewInit(): void {
    /** Take part of the tab group element to display it in the header template */
    this.portal = new DomPortal(this.tabGroup?.tabList);
    setTimeout(() => {
      this.setTabSize();
    }, 0);
  }

  /** Set tab size property */
  private setTabSize() {
    const tabSize = {
      width: this._host.nativeElement.offsetWidth,
      height: this._host.nativeElement.offsetHeight,
    };
    this.size = tabSize;
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
          template: this.dashboardService.findSettingsTemplate(this.widget),
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
}
