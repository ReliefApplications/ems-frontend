import { Dialog } from '@angular/cdk/dialog';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Dashboard } from '../../models/dashboard.model';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { ButtonActionT } from './button-action-type';

/** Component for display action buttons */
@Component({
  selector: 'shared-button-action',
  templateUrl: './button-action.component.html',
  styleUrls: ['./button-action.component.scss'],
})
export class ButtonActionComponent extends UnsubscribeComponent {
  /** Button actions */
  @Input() buttonActions: ButtonActionT[] = [];
  /** Dashboard */
  @Input() dashboard?: Dashboard;
  /** Can update dashboard or not */
  @Input() canUpdate = false;
  /** Context id of the current dashboard */
  private contextId!: string;

  /**
   * Action buttons
   *
   * @param dialog Dialog service
   * @param dataTemplateService DataTemplate service
   * @param router Angular router
   * @param activatedRoute Activated route
   */
  constructor(
    public dialog: Dialog,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ id }) => {
        this.contextId = id;
      },
    });
  }

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
    } else if (button.resource) {
      this.openRecordModal(button.template as string);
    }
  }

  /**
   * Open record modal to add/edit a record
   *
   * @param template Template id
   */
  private async openRecordModal(template: string) {
    const { FormModalComponent } = await import(
      '../form-modal/form-modal.component'
    );
    this.dialog.open(FormModalComponent, {
      disableClose: true,
      data: {
        recordId: this.contextId,
        template,
        actionButtonCtx: true,
      },
      autoFocus: false,
    });
  }
}
