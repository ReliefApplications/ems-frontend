import { Apollo } from 'apollo-angular';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  DuplicateApplicationMutationResponse,
  DUPLICATE_APPLICATION,
} from './graphql/mutations';
import { Application, SafeSnackBarService } from '@oort-front/safe';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '@oort-front/safe';
import { ButtonModule, Variant, Category } from '@oort-front/ui';

/**
 * Duplicate application component (modal)
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
    SafeModalModule,
    ButtonModule,
  ],
  selector: 'app-duplicate-application-modal',
  templateUrl: './duplicate-application-modal.component.html',
  styleUrls: ['./duplicate-application-modal.component.scss'],
})
export class DuplicateApplicationModalComponent implements OnInit {
  public currentApp: Application;
  public duplicateForm: UntypedFormGroup = new UntypedFormGroup({});

  // === BUTTON ===
  public variant = Variant;
  public category = Category;

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
    public dialogRef: MatDialogRef<DuplicateApplicationModalComponent>,
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
          this.dialogRef.close(data?.duplicateApplication);
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
