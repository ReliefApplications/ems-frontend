import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

/**
 * Tabs widget component.
 */
@Component({
  selector: 'shared-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent extends UnsubscribeComponent {
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
   * @param dialog Dialog service
   * @param dashboardService Shared dashboard service
   */
  constructor(
    private dialog: Dialog,
    private dashboardService: DashboardService
  ) {
    super();
  }

  /**
   * Open settings
   */
  async openSettings(): Promise<void> {
    const { TileDataComponent } = await import(
      '../../widget-grid/floating-options/menu/tile-data/tile-data.component'
    );
    const dialogRef = this.dialog.open(TileDataComponent, {
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
