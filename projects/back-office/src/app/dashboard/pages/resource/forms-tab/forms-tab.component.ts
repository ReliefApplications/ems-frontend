import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  Form,
  Resource,
  SafeConfirmService,
  SafeSnackBarService,
} from '@safe/builder';
import { TranslateService } from '@ngx-translate/core';
import { DeleteFormMutationResponse, DELETE_FORM } from './graphql/mutations';
import get from 'lodash/get';
import { MatDialog } from '@angular/material/dialog';
import { GetResourceByIdQueryResponse } from '../graphql/queries';
import { GET_RESOURCE_FORMS } from './graphql/queries';

/**
 *Forms tab of resource page
 */
@Component({
  selector: 'app-forms-tab',
  templateUrl: './forms-tab.component.html',
  styleUrls: ['./forms-tab.component.scss'],
})
export class FormsTabComponent implements OnInit {
  private resource!: Resource;
  public forms: Form[] = [];
  public loading = true;

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
   * @param dialog Material dialog service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.resource = get(state, 'resource', null);

    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_FORMS,
        variables: {
          id: this.resource.id,
        },
      })
      .subscribe((res) => {
        if (res.data.resource) {
          this.forms = res.data.resource.forms || [];
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
      confirmColor: 'warn',
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<DeleteFormMutationResponse>({
            mutation: DELETE_FORM,
            variables: {
              id: form.id,
            },
          })
          .subscribe(() => {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectDeleted', {
                value: this.translate.instant('common.form.one'),
              })
            );
            this.forms = this.forms.filter((x: any) => x.id !== form.id);
          });
      }
    });
  }
}
