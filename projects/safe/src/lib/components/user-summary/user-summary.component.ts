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

/**
 * User Summary shared component.
 */
@Component({
  selector: 'safe-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
})
export class SafeUserSummaryComponent implements OnInit {
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
   */
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.apollo
      .query<GetUserQueryResponse>({
        query: GET_USER,
        variables: {
          id: this.id,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.user = res.data.user;
        }
        this.loading = res.data.loading;
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
      .subscribe((res) => {
        if (res.data) {
          this.user = res.data.editUserProfile;
          this.loading = res.loading;
        }
      });
  }

  onEditRoles(event: { roles: string[]; application?: string }): void {
    this.loading = true;
    this.apollo
      .mutate<EditUserRolesMutationResponse>({
        mutation: EDIT_USER_ROLES,
        variables: {
          id: this.id,
          roles: event.roles,
          application: event.application,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.user = res.data.editUser;
          this.loading = res.loading;
        }
      });
  }
}
