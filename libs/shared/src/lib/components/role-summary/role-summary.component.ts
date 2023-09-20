import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Application } from '../../models/application.model';
import { Role } from '../../models/user.model';
import { BreadcrumbService } from '../../services/breadcrumb/breadcrumb.service';
import { EditRoleMutationResponse, EDIT_ROLE } from './graphql/mutations';
import { GetRoleQueryResponse, GET_ROLE } from './graphql/queries';

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
  @Input() id = '';
  @Input() application?: Application;
  public role?: Role;
  public loading = true;

  /**
   * Shared role summary component.
   * Divided into different categories.
   * This component allows edition of roles.
   *
   * @param apollo Apollo client
   * @param breadcrumbService Setups the breadcrumb component variables
   */
  constructor(
    private apollo: Apollo,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.apollo
      .query<GetRoleQueryResponse>({
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
      .subscribe(({ data, loading }) => {
        if (data) {
          this.role = data.editRole;
          this.loading = loading;
        }
      });
  }
}
