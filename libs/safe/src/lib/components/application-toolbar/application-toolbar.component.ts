import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Application } from '../../models/application.model';
import { SafeApplicationService } from '../../services/application/application.service';
import { SafeConfirmService } from '../../services/confirm/confirm.service';
import { SafeUnsubscribeComponent } from '../../components/utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';

/**
 * Toolbar component visible when editing application.
 * Appear on top of the view.
 */
@Component({
  selector: 'safe-app-application-toolbar',
  templateUrl: './application-toolbar.component.html',
  styleUrls: ['./application-toolbar.component.scss'],
})
export class SafeApplicationToolbarComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() title = '';
  @Input() settings: any[] = [];
  @Input() canUpdate = false;
  @Input() showActions = false;

  // === APPLICATION ===
  public application: Application | null = null;
  public locked: boolean | undefined = undefined;
  public lockedByUser: boolean | undefined = undefined;
  public canPublish = false;
  public user: any;

  /**
   * Toolbar component visible when editing application
   *
   * @param applicationService Shared application service
   * @param router Angular router
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   */
  constructor(
    private applicationService: SafeApplicationService,
    private router: Router,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        this.application = application;
        this.locked = this.application?.locked;
        this.lockedByUser = this.application?.lockedByUser;
        this.canPublish =
          !!this.application && this.application.pages
            ? this.application.pages.length > 0
            : false;
      });
  }

  /**
   * Closes the application, go back to the back-office dashboard.
   */
  onClose(): void {
    this.router.navigate(['/applications']);
  }

  /**
   * Unlocks the application, and controls edition.
   */
  onUnlock(): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('components.application.unlock.title'),
      content: this.translate.instant(
        'components.application.unlock.confirmationMessage',
        {
          name: this.application?.name,
        }
      ),
      confirmVariant: 'primary',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.applicationService.toggleApplicationLock();
    });
  }

  /**
   * Confirms publication of application, and makes it active.
   */
  onPublish(): void {
    if (this.locked && !this.lockedByUser) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectLocked', {
          name: this.application?.name,
        })
      );
    } else {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('components.application.publish.title'),
        content: this.translate.instant(
          'components.application.publish.confirmationMessage',
          {
            name: this.application?.name,
          }
        ),
        confirmVariant: 'primary',
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.applicationService.publish();
          }
        });
    }
  }

  /**
   * Edits the permissions layer.
   *
   * @param e permissions.
   */
  saveAccess(e: any): void {
    this.applicationService.editPermissions(e);
  }
}
