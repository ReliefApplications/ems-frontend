import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { ConfirmService } from '../../../services/confirm/confirm.service';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

/**
 * Button on top left of each widget, if user can see it, with menu of possible
 * actions for that widget.
 */
@Component({
  selector: 'shared-widget-actions',
  templateUrl: './widget-actions.component.html',
  styleUrls: ['./widget-actions.component.scss'],
})
export class WidgetActionsComponent extends UnsubscribeComponent {
  // === WIDGET ===
  @Input() widget: any;
  /** Can user edit widget */
  @Input() canUpdate = false;
  /** Collapse actions into a single button */
  @Input() collapsed = true;

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
    private dashboardService: DashboardService,
    private confirmService: ConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Opens a modal, or emit an event depending on the action clicked.
   *
   * @param action action
   */
  async onClick(
    action: 'settings' | 'expand' | 'style' | 'delete'
  ): Promise<void> {
    if (action === 'settings') {
      const { EditWidgetModalComponent } = await import(
        '../edit-widget-modal/edit-widget-modal.component'
      );
      const dialogRef = this.dialog.open(EditWidgetModalComponent, {
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
    if (action === 'expand') {
      this.expand.emit({ id: this.widget.id });
    }
    if (action === 'style') {
      this.style.emit({ widget: this.widget });
    }
    if (action === 'delete') {
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
