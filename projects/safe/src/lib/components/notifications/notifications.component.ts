import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Application } from '../../models/application.model';
import { CustomNotification } from '../../models/custom-notification.model';
import { SafeApplicationService } from '../../services/application/application.service';
import { SafeConfirmService } from '../../services/confirm/confirm.service';
import { EditNotificationModalComponent } from './components/edit-notification-modal/edit-notification-modal.component';
import {
  GetCustomNotificationsQueryResponse,
  GET_CUSTOM_NOTIFICATIONS,
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
export class NotificationsComponent implements OnInit, OnDestroy {
  // === INPUT DATA ===
  public notifications: MatTableDataSource<CustomNotification> =
    new MatTableDataSource<CustomNotification>([]);
  private cachedNotifications: CustomNotification[] = [];
  private notificationsQuery!: QueryRef<GetCustomNotificationsQueryResponse>;
  private applicationSubscription?: Subscription;

  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['name', 'status', 'lastExecution'];

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
   * @param dialog The material dialog service
   * @param translate The translation service
   * @param confirmService Shared confirmation service
   * @param apollo Apollo service
   * @param applicationService Shared application service
   */
  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private confirmService: SafeConfirmService,
    private apollo: Apollo,
    private applicationService: SafeApplicationService
  ) {}

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
              this.notifications.data = this.cachedNotifications.slice(
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
  onPage(e: any): void {
    console.log(e);
  }

  /**
   * Show a dialog to edit a notification
   *
   * @param notification The notification to edit
   */
  editNotification(notification: any): void {
    const dialogRef = this.dialog.open(EditNotificationModalComponent, {
      data: notification,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
      }
      // this.applicationService.editTemplate({
      //   id: template.id,
      //   name: value.name,
      //   type: TemplateTypeEnum.EMAIL,
      //   content: {
      //     subject: value.subject,
      //     body: value.body,
      //   },
      // });
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
        name: this.translate.instant('common.step.one'),
      }),
      // content: this.translate.instant(
      //   'pages.workflow.deleteStep.confirmationMessage',
      //   { step: step.name }
      // ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmColor: 'warn',
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        // this.applicationService.deleteTemplate(template.id);
      }
    });
  }

  /** Opens modal for adding a new notification */
  addNotification(): void {
    const dialogRef = this.dialog.open(EditNotificationModalComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
      }
      // this.applicationService.addTemplate({
      //   name: value.name,
      //   type: TemplateTypeEnum.EMAIL,
      //   content: {
      //     subject: value.subject,
      //     body: value.body,
      //   },
      // });
    });
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
