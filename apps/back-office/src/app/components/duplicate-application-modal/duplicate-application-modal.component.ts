import { Apollo } from 'apollo-angular';
import { Component, OnInit, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  DuplicateApplicationMutationResponse,
  DUPLICATE_APPLICATION,
} from './graphql/mutations';
import { Application } from '@oort-front/safe';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@oort-front/ui';
import {
  ButtonModule,
  SnackbarService,
  FormWrapperModule,
} from '@oort-front/ui';

/**
 * Duplicate application component (modal)
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormWrapperModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
  ],
  selector: 'app-duplicate-application-modal',
  templateUrl: './duplicate-application-modal.component.html',
  styleUrls: ['./duplicate-application-modal.component.scss'],
})
export class DuplicateApplicationModalComponent implements OnInit {
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
    private snackBar: SnackbarService,
    private formBuilder: UntypedFormBuilder,
    private apollo: Apollo,
    public dialogRef: DialogRef<DuplicateApplicationModalComponent>,
    private translateService: TranslateService,
    @Inject(DIALOG_DATA) public data: any
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
      .subscribe({
        next: ({ errors, data }) => {
          if (errors) {
            this.snackBar.openSnackBar(
              this.translateService.instant(
                'common.notifications.objectNotDuplicated',
                {
                  type: this.translateService
                    .instant('common.application.one')
                    .toLowerCase(),
                  error: errors ? errors[0].message : '',
                }
              ),
              { error: true }
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
          }
          this.dialogRef.close(data?.duplicateApplication as any);
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Close dialog.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
