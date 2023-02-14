import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Application } from '../../models/application.model';
import { CustomNotification } from '../../models/custom-notification.model';
import { SafeApplicationService } from '../application/application.service';
import {
  AddCustomNotificationMutationResponse,
  ADD_CUSTOM_NOTIFICATION,
  DeleteCustomNotificationMutationResponse,
  DELETE_CUSTOM_NOTIFICATION,
  UpdateCustomNotificationMutationResponse,
  UPDATE_CUSTOM_NOTIFICATION,
} from './graphql/mutations';

/**
 * Shared service to manage application's notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeApplicationNotificationsService {
  public application!: Application;

  /**
   * Shared service to manage application's notifications.
   *
   * @param apollo Apollo service
   * @param applicationService Shared application service
   */
  constructor(
    private apollo: Apollo,
    private applicationService: SafeApplicationService
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
        if (res.data) {
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
        if (res.data) {
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
        if (res.data) {
        }
      });
  }
}
