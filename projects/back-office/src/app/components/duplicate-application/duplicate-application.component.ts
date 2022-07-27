import { Apollo } from 'apollo-angular';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  DuplicateApplicationMutationResponse,
  DUPLICATE_APPLICATION,
} from '../../graphql/mutations';
import { Application, SafeSnackBarService } from '@safe/builder';
import { TranslateService } from '@ngx-translate/core';

/**
 * Duplicate application component (modal)
 */
@Component({
  selector: 'app-duplicate-application',
  templateUrl: './duplicate-application.component.html',
  styleUrls: ['./duplicate-application.component.scss'],
})
export class DuplicateApplicationComponent implements OnInit {
  public currentApp: Application;
  public duplicateForm: UntypedFormGroup = new UntypedFormGroup({});

  /**
   * Duplicate application component.
   *
   * @param snackBar Shared snackbar service
   * @param formBuilder Angular form builder
   * @param apollo Apollo service
   * @param dialogRef Material dialog ref
   * @param translateService Angular translate service
   * @param data Injected dialog data
   */
  constructor(
    private snackBar: SafeSnackBarService,
    private formBuilder: UntypedFormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<DuplicateApplicationComponent>,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentApp = data;
  }

  ngOnInit(): void {
    this.duplicateForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  /**
   * Submit duplicate application form.
   * Send mutation.
   */
  onSubmit(): void {
    this.apollo
      .mutate<DuplicateApplicationMutationResponse>({
        mutation: DUPLICATE_APPLICATION,
        variables: {
          name: this.duplicateForm.value.name,
          application: this.currentApp.id,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          this.snackBar.openSnackBar(
            this.translateService.instant(
              'common.notifications.objectNotDuplicated',
              {
                type: this.translateService
                  .instant('common.application.one')
                  .toLowerCase(),
                error: res.errors[0].message,
              }
            )
          );
        } else {
          this.snackBar.openSnackBar(
            this.translateService.instant(
              'common.notifications.objectDuplicated',
              {
                type: this.translateService
                  .instant('common.application.one')
                  .toLowerCase(),
                value: this.currentApp.name,
              }
            )
          );
          this.dialogRef.close(res.data?.duplicateApplication);
        }
      });
  }

  /**
   * Close dialog.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
