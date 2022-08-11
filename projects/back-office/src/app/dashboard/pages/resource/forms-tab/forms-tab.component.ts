import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  Form,
  SafeConfirmModalComponent,
  SafeSnackBarService,
} from '@safe/builder';
import { TranslateService } from '@ngx-translate/core';
import { DeleteFormMutationResponse, DELETE_FORM } from '../graphql/mutations';
import get from 'lodash/get';
import { MatDialog } from '@angular/material/dialog';

/**
 *Forms tab of resource page
 */
@Component({
  selector: 'app-forms-tab',
  templateUrl: './forms-tab.component.html',
  styleUrls: ['./forms-tab.component.scss'],
})
export class FormsTabComponent implements OnInit {
  public forms: Form[] = [];

  displayedColumnsForms: string[] = [
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
   * @param translate Angular translate service
   * @param dialog Material dialog service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.forms = get(state, 'forms', []);
  }

  /**
   * Removes a form.
   *
   * @param form Form to delete.
   * @param e click event.
   */
  deleteForm(form: Form, e: any): void {
    e.stopPropagation();
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
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
        cancelText: this.translate.instant('components.confirmModal.cancel'),
        confirmColor: 'warn',
      },
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
          .subscribe((res) => {
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
