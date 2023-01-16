import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Application } from '../../../models/application.model';
import { ContentType, Page } from '../../../models/page.model';
import { Role } from '../../../models/user.model';
import { SafeSnackBarService } from '../../../services/snackbar/snackbar.service';
import {
  EditPageAccessMutationResponse,
  EDIT_PAGE_ACCESS,
} from '../graphql/mutations';
import {
  GetApplicationFeaturesQueryResponse,
  GET_APPLICATION_FEATURES,
} from '../graphql/queries';

/**
 * Features tab of Role Summary component.
 * Visible only in applications.
 */
@Component({
  selector: 'safe-role-features',
  templateUrl: './role-features.component.html',
  styleUrls: ['./role-features.component.scss'],
})
export class RoleFeaturesComponent implements OnInit {
  @Input() role!: Role;
  @Input() application?: Application;
  @Input() loading = false;

  public dashboards: Page[] = [];
  public forms: Page[] = [];
  public workflows: Page[] = [];

  // search query
  public search = '';

  /**
   * Features tab of Role Summary component.
   * Visible only in applications.
   *
   * @param apollo Apollo service
   * @param snackBar Shared snackbar service
   */
  constructor(private apollo: Apollo, private snackBar: SafeSnackBarService) {}

  ngOnInit(): void {
    this.apollo
      .query<GetApplicationFeaturesQueryResponse>({
        query: GET_APPLICATION_FEATURES,
        variables: {
          id: this.application?.id,
        },
      })
      .subscribe(
        (res) => {
          if (res.data) {
            this.dashboards = get(res.data.application, 'pages', []).filter(
              (x) => x.type === ContentType.dashboard
            );
            this.forms = get(res.data.application, 'pages', []).filter(
              (x) => x.type === ContentType.form
            );
            this.workflows = get(res.data.application, 'pages', []).filter(
              (x) => x.type === ContentType.workflow
            );
          }
        },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        }
      );
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
      .mutate<EditPageAccessMutationResponse>({
        mutation: EDIT_PAGE_ACCESS,
        variables: {
          id: e.page,
          permissions: {
            canSee: e.action,
          },
        },
      })
      .subscribe(
        (res) => {
          if (res.data) {
            switch (res.data.editPage.type) {
              case ContentType.dashboard: {
                const index = this.dashboards.findIndex(
                  (x) => x.id === res.data?.editPage.id
                );
                const dashboards = [...this.dashboards];
                dashboards[index] = res.data.editPage;
                this.dashboards = dashboards;
                break;
              }
              case ContentType.form: {
                const index = this.forms.findIndex(
                  (x) => x.id === res.data?.editPage.id
                );
                const forms = [...this.forms];
                forms[index] = res.data.editPage;
                this.forms = forms;
                break;
              }
              case ContentType.workflow: {
                const index = this.workflows.findIndex(
                  (x) => x.id === res.data?.editPage.id
                );
                const workflows = [...this.workflows];
                workflows[index] = res.data.editPage;
                this.workflows = workflows;
                break;
              }
              default: {
                break;
              }
            }
          }
          this.loading = false;
        },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        }
      );
  }
}
