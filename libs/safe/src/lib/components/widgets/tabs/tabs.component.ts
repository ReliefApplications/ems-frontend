import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeDashboardService } from '../../../services/dashboard/dashboard.service';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

/**
 * Tabs widget component.
 */
@Component({
  selector: 'safe-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent extends SafeUnsubscribeComponent {
  /** Should display header */
  @Input() header = true;
  /** Widget settings */
  @Input() settings: any;
  /** Widget definition */
  @Input() widget: any;
  /** Editable widget */
  @Input() canUpdate = false;
  /** Widget edit event */
  @Output() edit: EventEmitter<any> = new EventEmitter();

  /**
   * Tabs widget component.
   *
   * @param dialog CDK Dialog service
   * @param dashboardService Shared dashboard service
   */
  constructor(
    private dialog: Dialog,
    private dashboardService: SafeDashboardService
  ) {
    super();
  }

  /**
   * Open settings
   */
  async openSettings(): Promise<void> {
    const { SafeTileDataComponent } = await import(
      '../../widget-grid/floating-options/menu/tile-data/tile-data.component'
    );
    const dialogRef = this.dialog.open(SafeTileDataComponent, {
      disableClose: true,
      data: {
        tile: this.widget,
        template: this.dashboardService.findSettingsTemplate(this.widget),
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res) {
        this.edit.emit({ type: 'data', id: this.widget.id, options: res });
      }
    });
  }
}
