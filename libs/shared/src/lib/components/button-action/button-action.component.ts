import { Component, Input } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { Dashboard } from '../../models/dashboard.model';
import { ButtonActionT } from './button-action-type';
import { Router } from '@angular/router';
import { Record } from '../../models/record.model';

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
  /** Context record of a dashboard  */
  @Input() contextRecord: Record | null = null;

  /**
   * @returns If the record edition action can be executed
   */
  get recordEditionIsAvailable(): boolean {
    return (
      Object.prototype.hasOwnProperty.call(
        this.dashboard?.page?.context,
        'resource'
      ) && this.contextRecord !== null
    );
  }

  /**
   * Action buttons
   *
   * @param dialog Dialog service
   * @param dataTemplateService DataTemplate service
   * @param router Angular router
   */
  constructor(
    public dialog: Dialog,
    private dataTemplateService: DataTemplateService,
    private router: Router
  ) {}

  /**
   * Executes button action.
   *
   * @param button Button action to be executed
   */
  public async onButtonActionClick(button: ButtonActionT) {
    switch (button.type) {
      // Opens record edition
      case 'recordEdition':
        if (this.recordEditionIsAvailable) {
          // TODO
        }
        break;
      // Email Notifications, to determine
      case 'emailNotification':
        break;
      // Link and legacy buttons (link, but no type is set)
      default:
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
        break;
    }
  }
}
