import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Application } from '../../models/application.model';
import { CustomNotification } from '../../models/custom-notification.model';
import { ApplicationService } from '../application/application.service';
import {
  AddCustomNotificationMutationResponse,
  ADD_CUSTOM_NOTIFICATION,
  DeleteCustomNotificationMutationResponse,
  DELETE_CUSTOM_NOTIFICATION,
  UpdateCustomNotificationMutationResponse,
  UPDATE_CUSTOM_NOTIFICATION,
} from './graphql/mutations';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
/**
 * Shared service to manage application's notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class ApplicationNotificationsService {
  /** Current application */
  public application!: Application;

  /**
   * Shared service to manage application's notifications.
   *
   * @param apollo Apollo service
   * @param applicationService Shared application service
   * @param snackBar Service used to show a snackbar.
   * @param translate Service used to get the translations.
   */
  constructor(
    private apollo: Apollo,
    private applicationService: ApplicationService,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {
    this.applicationService.application$.subscribe(
      (application: Application | null) => {
        if (application) {
          this.application = application;
        }
      }
    );
  }

  /**
   * Add a new custom notification
   *
   * @param notification notification to add
   */
  addNotification(notification: CustomNotification): void {
    this.apollo
      .mutate<AddCustomNotificationMutationResponse>({
        mutation: ADD_CUSTOM_NOTIFICATION,
        variables: {
          application: this.application.id,
          notification,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectNotCreated', {
              type: this.translate
                .instant('common.customNotification.one')
                .toLowerCase(),
              error: res.errors ? res.errors[0].message : '',
            }),
            { error: true }
          );
        } else {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectCreated', {
                type: this.translate.instant('common.customNotification.one'),
                value: '',
              })
            );
          }
        }
      });
  }

  /**
   * Delete a custom notification
   *
   * @param id id of notification to delete
   */
  deleteNotification(id: string): void {
    this.apollo
      .mutate<DeleteCustomNotificationMutationResponse>({
        mutation: DELETE_CUSTOM_NOTIFICATION,
        variables: {
          application: this.application.id,
          id,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectNotDeleted', {
              value: this.translate.instant('common.customNotification.one'),
              error: res.errors ? res.errors[0].message : '',
            }),
            { error: true }
          );
        } else {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectDeleted', {
                value: this.translate.instant('common.customNotification.one'),
              })
            );
          }
        }
      });
  }

  /**
   * Edit an existing custom notification
   *
   * @param notification notification to edit
   */
  editNotification(notification: CustomNotification): void {
    this.apollo
      .mutate<UpdateCustomNotificationMutationResponse>({
        mutation: UPDATE_CUSTOM_NOTIFICATION,
        variables: {
          application: this.application.id,
          id: notification.id,
          notification,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectNotUpdated', {
              value: this.translate.instant('common.customNotification.one'),
              error: res.errors ? res.errors[0].message : '',
            }),
            { error: true }
          );
        } else {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate.instant('common.customNotification.one'),
                value: '',
              })
            );
          }
        }
      });
  }
}
