import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  SafeBreadcrumbService,
  SafeSnackBarService
} from '@safe/builder';
import { TranslateService } from '@ngx-translate/core';
import {
  DeleteFormMutationResponse,
  DELETE_FORM,
} from '../../../../graphql/mutations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forms-tab',
  templateUrl: './forms-tab.component.html',
  styleUrls: ['./forms-tab.component.scss']
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

  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService,
    private breadcrumbService: SafeBreadcrumbService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }


  /**
   * Delete a form if authorized.
   *
   * @param id Id of the form to delete.
   * @param e Used to prevent the default behaviour.
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
        this.dataSourceForms = this.dataSourceForms.filter((x: any) => x.id !== id);
      });
  }

  public editForm(id: number) {
    this.breadcrumbService.keepPreviousRoute();
    this.router.navigate(['/forms/builder', id])
  }

}
