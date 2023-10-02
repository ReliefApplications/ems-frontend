import { Component, Input, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';
import {
  Application,
  ApplicationService,
  ConfirmService,
  UnsubscribeComponent,
} from '@oort-front/shared';

/**
 * Header component visible when editing application.
 * Appear on top of the view.
 */
@Component({
  selector: 'app-application-header',
  templateUrl: './application-header.component.html',
  styleUrls: ['./application-header.component.scss'],
})
export class ApplicationHeaderComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Application title */
  @Input() title = '';
  /** Admin routes */
  @Input() navItems: any[] = [];
  /** Can user update application */
  @Input() canUpdate = false;
  /** Current application */
  public application: Application | null = null;
  /** Is edition of application locked */
  public locked: boolean | undefined = undefined;
  /** User that locked edition */
  public lockedByUser: boolean | undefined = undefined;
  /** Can application be published */
  public canPublish = false;

  /**
   * Header component visible when editing application
   *
   * @param applicationService Shared application service
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   */
  constructor(
    private applicationService: ApplicationService,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private confirmService: ConfirmService,
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
}
