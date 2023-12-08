import { Apollo } from 'apollo-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { DUPLICATE_APPLICATION } from './graphql/mutations';
import {
  Application,
  DuplicateApplicationMutationResponse,
  SnackbarSpinnerComponent,
} from '@oort-front/shared';
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
export class DuplicateApplicationModalComponent {
  /** Application to duplicate */
  public currentApp: Application;
  /** Duplication form group */
  public duplicateForm = this.fb.group({
    name: ['', Validators.required],
  });
  /** Loading indicator */
  public loading = false;

  /**
   * Duplicate application component.
   *
   * @param snackBar Shared snackbar service
   * @param fb Angular form builder
   * @param apollo Apollo service
   * @param dialogRef Dialog ref
   * @param translateService Angular translate service
   * @param data Injected dialog data
   */
  constructor(
    private snackBar: SnackbarService,
    private fb: FormBuilder,
    private apollo: Apollo,
    public dialogRef: DialogRef<DuplicateApplicationModalComponent>,
    private translateService: TranslateService,
    @Inject(DIALOG_DATA) public data: any
  ) {
    this.currentApp = data;
  }

  /**
   * Submit duplicate application form.
   * Send mutation.
   */
  onDuplicate(): void {
    this.loading = true;
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SnackbarSpinnerComponent,
      {
        duration: 0,
        data: {
          message: 'Duplicating',
          loading: true,
        },
      }
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;
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
            snackBarSpinner.instance.message = this.translateService.instant(
              'common.notifications.objectNotDuplicated',
              {
                type: this.translateService
                  .instant('common.application.one')
                  .toLowerCase(),
                error: errors ? errors[0].message : '',
              }
            );
            snackBarSpinner.instance.error = true;
          } else {
            snackBarSpinner.instance.message = this.translateService.instant(
              'common.notifications.objectDuplicated',
              {
                type: this.translateService
                  .instant('common.application.one')
                  .toLowerCase(),
                value: this.currentApp.name,
              }
            );
          }
          snackBarSpinner.instance.loading = false;
          this.dialogRef.close(data?.duplicateApplication as any);
        },
        error: (err) => {
          snackBarSpinner.instance.message = err.message;
          snackBarSpinner.instance.loading = false;
          snackBarSpinner.instance.error = true;
        },
      });
  }
}
