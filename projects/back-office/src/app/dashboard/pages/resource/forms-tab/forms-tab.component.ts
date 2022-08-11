import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SafeSnackBarService } from '@safe/builder';
import { TranslateService } from '@ngx-translate/core';
import { DeleteFormMutationResponse, DELETE_FORM } from '../graphql/mutations';

/**
 *Forms tab of resource page
 */
@Component({
  selector: 'app-forms-tab',
  templateUrl: './forms-tab.component.html',
  styleUrls: ['./forms-tab.component.scss'],
})
export class FormsTabComponent implements OnInit {
  @Input() dataSourceForms: any;

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
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  /**
   * Delete a form if authorized.
   *
   * @param id Id of the form to delete.
   * @param e Used to prevent the default behavior.
   */
  deleteForm(id: any, e: any): void {
    e.stopPropagation();
    this.apollo
      .mutate<DeleteFormMutationResponse>({
        mutation: DELETE_FORM,
        variables: {
          id,
        },
      })
      .subscribe((res) => {
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectDeleted', {
            value: this.translate.instant('common.form.one'),
          })
        );
        this.dataSourceForms = this.dataSourceForms.filter(
          (x: any) => x.id !== id
        );
      });
  }
}
