import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Application } from '../../models/application.model';
import {
  EditRoleMutationResponse,
  Role,
  RoleQueryResponse,
} from '../../models/user.model';
import { BreadcrumbService } from '../../services/breadcrumb/breadcrumb.service';
import { EDIT_ROLE } from './graphql/mutations';
import { GET_ROLE } from './graphql/queries';
import { SnackbarService } from '@oort-front/ui';

/**
 * Shared role summary component.
 * Divided into different categories.
 * This component allows edition of roles.
 */
@Component({
  selector: 'shared-role-summary',
  templateUrl: './role-summary.component.html',
  styleUrls: ['./role-summary.component.scss'],
})
export class RoleSummaryComponent implements OnInit {
  /** Role id */
  @Input() id = '';
  /** Application */
  @Input() application?: Application;
  /** Role */
  public role?: Role;
  /** Loading status */
  public loading = true;

  /**
   * Shared role summary component.
   * Divided into different categories.
   * This component allows edition of roles.
   *
   * @param apollo Apollo client
   * @param breadcrumbService Setups the breadcrumb component variables
   * @param snackBar Shared snackbar service
   */
  constructor(
    private apollo: Apollo,
    private breadcrumbService: BreadcrumbService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.apollo
      .query<RoleQueryResponse>({
        query: GET_ROLE,
        variables: {
          id: this.id,
        },
      })
      .subscribe(({ data, loading }) => {
        if (data) {
          this.role = data.role;
          this.breadcrumbService.setBreadcrumb(
            '@role',
            this.role.title as string
          );
        }
        this.loading = loading;
      });
  }

  /**
   * Edit opened role.
   * Submit a mutation.
   *
   * @param e update event
   */
  onEditRole(e: any): void {
    this.loading = true;
    this.apollo
      .mutate<EditRoleMutationResponse>({
        mutation: EDIT_ROLE,
        variables: { ...e, id: this.id },
      })
      .subscribe(({ data, errors, loading }) => {
        if (errors) {
          this.snackBar.openSnackBar(errors[0].message, { error: true });
        } else {
          this.role = data?.editRole;
          this.breadcrumbService.setBreadcrumb(
            '@role',
            this.role?.title as string
          );
        }
        this.loading = loading;
      });
  }
}
