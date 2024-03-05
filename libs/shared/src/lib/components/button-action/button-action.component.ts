import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { Dashboard } from '../../models/dashboard.model';
import { ButtonActionT } from './button-action-type';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { isNil } from 'lodash';

/** Component for display action buttons */
@Component({
  selector: 'shared-button-action',
  templateUrl: './button-action.component.html',
  styleUrls: ['./button-action.component.scss'],
})
export class ButtonActionComponent {
  /** Button actions */
  @Input() buttonActions: ButtonActionT[] = [];
  /** Dashboard */
  @Input() dashboard?: Dashboard;
  /** Can update dashboard or not */
  @Input() canUpdate = false;

  /**
   * Action buttons
   *
   * @param dialog Dialog service
   * @param dashboardService Shared dashboard service
   * @param translateService Angular translate service
   * @param dataTemplateService DataTemplate service
   * @param router Angular router
   */
  constructor(
    public dialog: Dialog,
    private dashboardService: DashboardService,
    private translateService: TranslateService,
    private dataTemplateService: DataTemplateService,
    private router: Router
  ) {}

  /**
   * Opens link of button action.
   *
   * @param button Button action to be executed
   */
  public onButtonActionClick(button: ButtonActionT) {
    if (button.href) {
      const href = this.dataTemplateService.renderLink(button.href);
      if (button.openInNewTab) {
        window.open(href, '_blank');
      } else {
        if (href?.startsWith('./')) {
          // Navigation inside the app builder
          this.router.navigateByUrl(href.substring(1));
        } else {
          window.location.href = href;
        }
      }
    }
  }

  /**
   * Removes button action from the dashboard.
   *
   * @param idx Index of button action to be removed
   */
  public async onDeleteButtonAction(idx: number) {
    const { ConfirmModalComponent } = await import(
      '../confirm-modal/confirm-modal.component'
    );
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
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

    dialogRef.closed
      .pipe(
        filter((value: any) => !isNil(value)),
        switchMap(() => {
          const currButtons = this.dashboard?.buttons || [];
          currButtons.splice(idx, 1);
          return this.dashboardService.saveDashboardButtons(
            this.dashboard?.id,
            currButtons
          );
        })
      )
      .subscribe();
  }
}
