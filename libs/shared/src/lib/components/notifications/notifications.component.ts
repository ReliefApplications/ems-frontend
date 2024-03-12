import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UIPageChangeEvent } from '@oort-front/ui';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription, takeUntil } from 'rxjs';
import {
  Application,
  ApplicationCustomNotificationsNodesQueryResponse,
} from '../../models/application.model';
import { CustomNotification } from '../../models/custom-notification.model';
import { ApplicationService } from '../../services/application/application.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { GET_CUSTOM_NOTIFICATIONS } from './graphql/queries';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom notifications table component.
 */
@Component({
  selector: 'shared-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  // === INPUT DATA ===
  /** Notifications array */
  public notifications: Array<CustomNotification> =
    new Array<CustomNotification>();
  /** Cached notifications array */
  private cachedNotifications: CustomNotification[] = [];
  /** Notifications query reference*/
  private notificationsQuery!: QueryRef<ApplicationCustomNotificationsNodesQueryResponse>;
  /** Application subscription */
  private applicationSubscription?: Subscription;

  // === DISPLAYED COLUMNS ===
  /** List of displayed columns */
  public displayedColumns = ['name', 'status', 'lastExecution', 'actions'];

  /** Loading state */
  public loading = true;
  /** Updating state */
  public updating = false;
  /** Page info */
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
   */
  constructor(
    public dialog: Dialog,
    private translate: TranslateService,
    private confirmService: ConfirmService,
    private apollo: Apollo,
    private applicationService: ApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.notificationsQuery =
              this.apollo.watchQuery<ApplicationCustomNotificationsNodesQueryResponse>(
                {
                  query: GET_CUSTOM_NOTIFICATIONS,
                  variables: {
                    first: DEFAULT_PAGE_SIZE,
                    application: application.id,
                  },
                }
              );
            this.notificationsQuery.valueChanges.subscribe({
              next: (res) => {
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
              },
              error: () => {
                this.loading = false;
                this.updating = false;
              },
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
    console.log(e);
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
