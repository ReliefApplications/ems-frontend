import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import { SafeDashboardService } from '../../services/dashboard/dashboard.service';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { Dashboard } from '../../models/dashboard.model';
import { ButtonActionT } from './button-action-type';

/** Component for display action buttons */
@Component({
  selector: 'safe-button-action',
  templateUrl: './button-action.component.html',
  styleUrls: ['./button-action.component.scss'],
})
export class ButtonActionComponent {
  @Input() buttonActions: ButtonActionT[] = [];
  @Input() dashboard?: Dashboard;
  @Input() canUpdate = false;

  /**
   * Action buttons
   *
   * @param dialog Dialog service
   * @param dashboardService Shared dashboard service
   * @param translateService Angular translate service
   * @param dataTemplateService DataTemplate service
   */
  constructor(
    public dialog: Dialog,
    private dashboardService: SafeDashboardService,
    private translateService: TranslateService,
    private dataTemplateService: DataTemplateService
  ) {}

  /**
   * Opens link of button action.
   *
   * @param button Button action to be executed
   */
  public onButtonActionClick(button: ButtonActionT) {
    if (button.href) {
      const href = this.dataTemplateService.renderLink(button.href);
      if (button.openInNewTab) window.open(href, '_blank');
      else window.location.href = href;
    }
  }

  /**
   * Removes button action from the dashboard.
   *
   * @param idx Index of button action to be removed
   */
  public async onDeleteButtonAction(idx: number) {
    const { SafeConfirmModalComponent } = await import(
      '../confirm-modal/confirm-modal.component'
    );
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translateService.instant('common.deleteObject', {
          name: this.translateService.instant(
            'models.dashboard.buttonActions.one'
          ),
        }),
        content: this.translateService.instant(
          'models.dashboard.buttonActions.confirmDelete'
        ),
        confirmText: this.translateService.instant(
          'components.confirmModal.delete'
        ),
        cancelText: this.translateService.instant(
          'components.confirmModal.cancel'
        ),
        confirmVariant: 'danger',
      },
    });

    dialogRef.closed.subscribe((value: any) => {
      if (value) {
        const currButtons = this.dashboard?.buttons || [];
        currButtons.splice(idx, 1);
        this.dashboardService.saveDashboardButtons(currButtons);
      }
    });
  }
}
