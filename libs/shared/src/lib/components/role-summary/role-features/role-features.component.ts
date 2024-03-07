import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import {
  Application,
  ApplicationQueryResponse,
} from '../../../models/application.model';
import {
  ContentType,
  EditPageMutationResponse,
  Page,
} from '../../../models/page.model';
import { Role } from '../../../models/user.model';
import { EDIT_PAGE_ACCESS } from '../graphql/mutations';
import { GET_APPLICATION_FEATURES } from '../graphql/queries';
import { SnackbarService } from '@oort-front/ui';

/**
 * Features tab of Role Summary component.
 * Visible only in applications.
 */
@Component({
  selector: 'shared-role-features',
  templateUrl: './role-features.component.html',
  styleUrls: ['./role-features.component.scss'],
})
export class RoleFeaturesComponent implements OnInit {
  /** Role */
  @Input() role!: Role;
  /** Application */
  @Input() application?: Application;
  /** Loading status */
  @Input() loading = false;

  /** Dashboards array */
  public dashboards: Page[] = [];
  /** Forms array */
  public forms: Page[] = [];
  /** Workflows array */
  public workflows: Page[] = [];

  /** Search query */
  public search = '';

  /**
   * Features tab of Role Summary component.
   * Visible only in applications.
   *
   * @param apollo Apollo service
   * @param snackBar Shared snackbar service
   */
  constructor(private apollo: Apollo, private snackBar: SnackbarService) {}

  ngOnInit(): void {
    this.apollo
      .query<ApplicationQueryResponse>({
        query: GET_APPLICATION_FEATURES,
        variables: {
          id: this.application?.id,
        },
      })
      .subscribe({
        next: ({ data }) => {
          if (data) {
            this.dashboards = get(data.application, 'pages', []).filter(
              (x) => x.type === ContentType.dashboard
            );
            this.forms = get(data.application, 'pages', []).filter(
              (x) => x.type === ContentType.form
            );
            this.workflows = get(data.application, 'pages', []).filter(
              (x) => x.type === ContentType.workflow
            );
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Edits the specified page with given permissions
   * and updates the correspondent array
   *
   * @param e Object with page id and array of permissions to be applied
   */
  onEditAccess(e: any): void {
    this.loading = true;
    this.apollo
      .mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE_ACCESS,
        variables: {
          id: e.page,
          permissions: {
            canSee: e.action,
          },
        },
      })
      .subscribe({
        next: ({ data, loading }) => {
          if (data) {
            switch (data.editPage.type) {
              case ContentType.dashboard: {
                const index = this.dashboards.findIndex(
                  (x) => x.id === data?.editPage.id
                );
                const dashboards = [...this.dashboards];
                dashboards[index] = data.editPage;
                this.dashboards = dashboards;
                break;
              }
              case ContentType.form: {
                const index = this.forms.findIndex(
                  (x) => x.id === data?.editPage.id
                );
                const forms = [...this.forms];
                forms[index] = data.editPage;
                this.forms = forms;
                break;
              }
              case ContentType.workflow: {
                const index = this.workflows.findIndex(
                  (x) => x.id === data?.editPage.id
                );
                const workflows = [...this.workflows];
                workflows[index] = data.editPage;
                this.workflows = workflows;
                break;
              }
              default: {
                break;
              }
            }
          }
          this.loading = loading;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.loading = false;
        },
      });
  }
}
