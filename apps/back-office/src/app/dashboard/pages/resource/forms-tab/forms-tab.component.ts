import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  DeleteFormMutationResponse,
  Form,
  Resource,
  ConfirmService,
  UnsubscribeComponent,
  ResourceQueryResponse,
} from '@oort-front/shared';
import { TranslateService } from '@ngx-translate/core';
import { DELETE_FORM } from './graphql/mutations';
import get from 'lodash/get';
import { GET_RESOURCE_FORMS } from './graphql/queries';
import { Dialog } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';
import { filter, switchMap, takeUntil } from 'rxjs';
import { isNil } from 'lodash';

/**
 *Forms tab of resource page
 */
@Component({
  selector: 'app-forms-tab',
  templateUrl: './forms-tab.component.html',
  styleUrls: ['./forms-tab.component.scss'],
})
export class FormsTabComponent extends UnsubscribeComponent implements OnInit {
  /**
   * Resource
   */
  private resource!: Resource;
  /**
   * Forms
   */
  public forms: Form[] = [];
  /**
   * Loading state
   */
  public loading = true;

  /**
   * Columns to display
   */
  public displayedColumnsForms: string[] = [
    'name',
    'createdAt',
    'status',
    'recordsCount',
    'core',
    '_actions',
  ];

  /**
   * Forms tab of resource page
   *
   * @param apollo Apollo service
   * @param snackBar Shared snackbar service
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   * @param dialog Dialog service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private dialog: Dialog
  ) {
    super();
  }

  ngOnInit(): void {
    const state = history.state;
    this.resource = get(state, 'resource', null);

    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE_FORMS,
        variables: {
          id: this.resource?.id,
        },
      })
      .subscribe(({ data }) => {
        if (data.resource) {
          this.forms = data.resource.forms || [];
        }
        this.loading = false;
      });
  }

  /**
   * Removes a form.
   *
   * @param form Form to delete.
   * @param e click event.
   */
  deleteForm(form: Form, e: any): void {
    e.stopPropagation();
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.form.one'),
      }),
      content: this.translate.instant(
        'components.form.delete.confirmationMessage',
        {
          name: form.name,
        }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed
      .pipe(
        filter((value: any) => !isNil(value)),
        switchMap(() => {
          return this.apollo.mutate<DeleteFormMutationResponse>({
            mutation: DELETE_FORM,
            variables: {
              id: form.id,
            },
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ errors }) => {
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotDeleted', {
                value: this.translate.instant('common.form.one'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectDeleted', {
                value: this.translate.instant('common.form.one'),
              })
            );
            this.forms = this.forms.filter((x: any) => x.id !== form.id);
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }
}
