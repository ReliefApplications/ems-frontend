import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SafeDashboardService } from '../../../services/dashboard/dashboard.service';
import { SafeConfirmService } from '../../../services/confirm/confirm.service';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

/**
 * Button on top left of each widget, if user can see it, with menu of possible
 * actions for that widget.
 */
@Component({
  selector: 'safe-floating-options',
  templateUrl: './floating-options.component.html',
  styleUrls: ['./floating-options.component.scss'],
})
export class SafeFloatingOptionsComponent extends SafeUnsubscribeComponent {
  // === WIDGET ===
  @Input() widget: any;

  // === EMIT ACTION SELECTED ===
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() expand: EventEmitter<any> = new EventEmitter();
  @Output() style: EventEmitter<any> = new EventEmitter();

  /**
   * Button on top left of each widget, if user can see it, with menu of possible
   * actions for that widget.
   *
   * @param dialog Dialog service
   * @param dashboardService Dashboard service
   * @param confirmService Confirm service
   * @param translate Translation service
   */
  constructor(
    public dialog: Dialog,
    private dashboardService: SafeDashboardService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Opens a modal, or emit an event depending on the action clicked.
   *
   * @param action action
   */
  async onClick(action: any): Promise<void> {
    if (action === 'Settings') {
      const { SafeTileDataComponent } = await import(
        './menu/tile-data/tile-data.component'
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
    if (action === 'Expand') {
      this.expand.emit({ id: this.widget.id });
    }
    if (action === 'Style') {
      this.style.emit({ widget: this.widget });
    }
    if (action === 'Delete') {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('models.widget.delete.title'),
        content: this.translate.instant(
          'models.widget.delete.confirmationMessage'
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        confirmVariant: 'danger',
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.delete.emit({ id: this.widget.id });
          }
        });
    }
  }
}
