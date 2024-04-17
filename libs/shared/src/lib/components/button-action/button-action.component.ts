import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { Dashboard } from '../../models/dashboard.model';
import { ButtonActionT } from './button-action-type';
import { Router } from '@angular/router';
import { Record } from '../../models/record.model';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

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
  /** Context record of a dashboard  */
  @Input() contextRecord: Record | null = null;
  /**
   *
   */
  @Output() refreshContextRecord: EventEmitter<void> = new EventEmitter();

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
  ) {
    super();
  }

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
          const { FormModalComponent } = await import(
            '../form-modal/form-modal.component'
          );
          const dialogRef = this.dialog.open(FormModalComponent, {
            disableClose: true,
            data: {
              recordId: this.contextRecord?.id,
              askForConfirm: false
            },
            autoFocus: false,
          });
          dialogRef.closed
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: any) => {
              if (value) {
                this.refreshContextRecord.emit();
              }
            });
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
