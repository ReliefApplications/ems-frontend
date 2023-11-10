import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { WidgetComponent } from '../../widget/widget.component';

/**
 * Section widget component.
 */
@Component({
  selector: 'shared-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent extends UnsubscribeComponent {
  /** Widget settings */
  @Input() settings: any;
  /** Widget definition */
  @Input() widget: any;
  /** Editable widget */
  @Input() canUpdate = false;
  /** Widget edit event */
  @Output() edit: EventEmitter<any> = new EventEmitter();

  /**
   * Section widget component.
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
