import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Application } from '../../models/application.model';
import { User } from '../../models/user.model';
import {
  EditUserProfileMutationResponse,
  EditUserRolesMutationResponse,
  EDIT_USER_PROFILE,
  EDIT_USER_ROLES,
} from './graphql/mutations';
import { GetUserQueryResponse, GET_USER } from './graphql/queries';
import { BreadcrumbService } from '../../services/breadcrumb/breadcrumb.service';
import { SnackbarService } from '@oort-front/ui';

/**
 * User Summary shared component.
 */
@Component({
  selector: 'shared-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
})
export class UserSummaryComponent implements OnInit {
  @Input() id = '';
  @Input() application?: Application;
  public user?: User;
  public loading = true;

  /** @returns title of the page */
  get title(): string {
    if (this.user) {
      if (this.user.firstName && this.user.lastName) {
        return `${this.user?.firstName} ${this.user?.lastName}`;
      } else {
        return `${this.user.name ? this.user.name : this.user.username}`;
      }
    } else {
      return '';
    }
  }

  /**
   * User Summary shared component.
   *
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param breadcrumbService Setups the breadcrumb component
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.apollo
      .query<GetUserQueryResponse>({
        query: GET_USER,
        variables: {
          id: this.id,
        },
      })
      .subscribe({
        next: ({ data, loading }) => {
          if (data) {
            this.user = data.user;
            this.breadcrumbService.setBreadcrumb(
              '@user',
              this.user.name as string
            );
          }
          this.loading = loading;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Edit Profile of user.
   *
   * @param e update event
   */
  onEditProfile(e: any): void {
    this.loading = true;
    this.apollo
      .mutate<EditUserProfileMutationResponse>({
        mutation: EDIT_USER_PROFILE,
        variables: {
          profile: e,
          id: this.id,
        },
      })
      .subscribe({
        next: ({ data, loading }) => {
          if (data) {
            this.user = data.editUserProfile;
            this.loading = loading;
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Modify the roles of an user
   *
   * @param event An object with the new data
   * @param event.roles the array of updated roles
   * @param event.groups the array of updated groups
   * @param event.application the id of an application, if the roles are associated with it
   */
  onEditRoles(event: {
    roles?: string[];
    groups?: string[];
    application?: string;
  }): void {
    this.loading = true;
    this.apollo
      .mutate<EditUserRolesMutationResponse>({
        mutation: EDIT_USER_ROLES,
        variables: {
          id: this.id,
          roles: event.roles,
          groups: event.groups,
          application: event.application,
        },
      })
      .subscribe({
        next: ({ data, loading }) => {
          if (data) {
            this.user = data.editUser;
            this.loading = loading;
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }
}
