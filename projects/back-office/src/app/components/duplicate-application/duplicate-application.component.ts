import { Apollo } from 'apollo-angular';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DuplicateApplicationMutationResponse,
  DUPLICATE_APPLICATION,
} from '../../graphql/mutations';
import { Application, SafeSnackBarService, NOTIFICATIONS } from '@safe/builder';

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
  public duplicateForm: FormGroup = new FormGroup({});

  /**
   * Duplicate application component.
   *
   * @param snackBar Shared snackbar service
   * @param formBuilder Angular form builder
   * @param apollo Apollo service
   * @param dialogRef Material dialog ref
   * @param data Injected dialog data
   */
  constructor(
    private snackBar: SafeSnackBarService,
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<DuplicateApplicationComponent>,
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
            NOTIFICATIONS.objectNotDuplicated('App', res.errors[0].message)
          );
        } else {
          this.snackBar.openSnackBar(
            NOTIFICATIONS.objectDuplicated('App', this.currentApp.name)
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
