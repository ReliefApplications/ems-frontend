import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { SafeConfirmService } from '../../services/confirm/confirm.service';
import { EditNotificationModalComponent } from './components/edit-notification-modal/edit-notification-modal.component';

/**
 * Custom notifications table component.
 */
@Component({
  selector: 'safe-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  // === INPUT DATA ===
  public notifications: MatTableDataSource<any> = new MatTableDataSource<any>(
    []
  );
  // @Input() applicationService!: SafeApplicationService;

  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['name', 'status', 'lastExecution'];

  public loading = false;

  /**
   * Custom notifications table component.
   *
   * @param dialog The material dialog service
   * @param translate The translation service
   */
  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private confirmService: SafeConfirmService
  ) {}

  ngOnInit(): void {
    // this.applicationService.application$.subscribe((value) => {
    //   this.templates.data = value?.templates || [];
    // });
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
}
