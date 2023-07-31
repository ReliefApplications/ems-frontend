import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService, UIPageChangeEvent } from '@oort-front/ui';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription, takeUntil } from 'rxjs';
import { Application } from '../../models/application.model';
import { CustomNotification } from '../../models/custom-notification.model';
import { SafeApplicationService } from '../../services/application/application.service';
import { SafeConfirmService } from '../../services/confirm/confirm.service';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import {
  GET_CUSTOM_NOTIFICATIONS,
  GetCustomNotificationsQueryResponse,
} from './graphql/queries';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom notifications table component.
 */
@Component({
  selector: 'safe-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy
{
  // === INPUT DATA ===
  public notifications: Array<CustomNotification> =
    new Array<CustomNotification>();
  private cachedNotifications: CustomNotification[] = [];
  private notificationsQuery!: QueryRef<GetCustomNotificationsQueryResponse>;
  private applicationSubscription?: Subscription;

  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['name', 'status', 'lastExecution', 'actions'];

  public loading = true;
  public updating = false;
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /**
   * Custom notifications table component.
   *
   * @param dialog The Dialog service
   * @param translate The translation service
   * @param confirmService Shared confirmation service
   * @param apollo Apollo service
   * @param applicationService Shared application service
   * @param snackBar Shared snackbar service
   */
  constructor(
    public dialog: Dialog,
    private translate: TranslateService,
    private confirmService: SafeConfirmService,
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
    private snackBar: SnackbarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.notificationsQuery =
              this.apollo.watchQuery<GetCustomNotificationsQueryResponse>({
                query: GET_CUSTOM_NOTIFICATIONS,
                variables: {
                  first: DEFAULT_PAGE_SIZE,
                  application: application.id,
                },
              });
            this.notificationsQuery.valueChanges.subscribe((res) => {
              this.cachedNotifications =
                res.data.application.customNotifications.edges.map(
                  (x) => x.node
                );
              this.notifications = this.cachedNotifications.slice(
                this.pageInfo.pageSize * this.pageInfo.pageIndex,
                this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
              );
              this.pageInfo.length =
                res.data.application.customNotifications.totalCount;
              this.pageInfo.endCursor =
                res.data.application.customNotifications.pageInfo.endCursor;
              this.loading = res.loading;
              this.updating = false;
            });
          }
        }
      );
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: UIPageChangeEvent): void {
    // console.log(e);
  }

  /**
   * Show a dialog to edit a notification
   *
   * @param notification The notification to edit
   */
  async editNotification(notification: any): Promise<void> {
    const { EditNotificationModalComponent } = await import(
      './components/edit-notification-modal/edit-notification-modal.component'
    );
    const dialogRef = this.dialog.open(EditNotificationModalComponent, {
      data: { notification },
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.updating = true;
        this.applicationService.updateCustomNotification(
          notification.id,
          value,
          () => {
            this.notificationsQuery.refetch();
          }
        );
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectUpdated', {
            value: value.name,
            type: this.translate.instant('common.customNotification.one'),
          })
        );
      }
    });
  }

  /**
   * Show a dialog to confirm the deletion of a notification
   *
   * @param notification notification to be deleted
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteNotification(notification: any): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.customNotification.one'),
      }),
      // content: this.translate.instant(
      //   'pages.workflow.deleteStep.confirmationMessage',
      //   { step: step.name }
      // ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.deleteCustomNotification(
          notification.id,
          () => {
            this.notificationsQuery.refetch();
          }
        );
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectDeleted', {
            value: notification.name,
          })
        );
      }
    });
  }

  /** Opens modal for adding a new notification */
  async addNotification(): Promise<void> {
    const { EditNotificationModalComponent } = await import(
      './components/edit-notification-modal/edit-notification-modal.component'
    );
    const dialogRef = this.dialog.open(EditNotificationModalComponent, {
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.addCustomNotification(value, () => {
          this.notificationsQuery.refetch();
        });
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectCreated', {
            value: value.name,
            type: this.translate.instant('common.customNotification.one'),
          })
        );
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
