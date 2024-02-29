import { Dialog } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { takeUntil } from 'rxjs';
import { DomPortal } from '@angular/cdk/portal';
import { TabsComponent as UiTabsComponent } from '@oort-front/ui';
import { WidgetComponent } from '../../widget/widget.component';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';

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
  implements AfterViewInit
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
  /** Reference to ui tab group */
  @ViewChild(UiTabsComponent)
  tabGroup?: UiTabsComponent;
  /** CDK portal. Allow to display part of the tab group element in another place */
  portal?: DomPortal;
  /** Selected tab index */
  selectedIndex = 0;

  /**
   * Tabs widget component.
   *
   * @param widgetComponent parent widget component ( optional )
   * @param dialog Dialog service
   * @param dashboardService Shared dashboard service
   */
  constructor(
    @Optional() public widgetComponent: WidgetComponent,
    private dialog: Dialog,
    private dashboardService: DashboardService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    /** Take part of the tab group element to display it in the header template */
    this.portal = new DomPortal(this.tabGroup?.tabList);
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
