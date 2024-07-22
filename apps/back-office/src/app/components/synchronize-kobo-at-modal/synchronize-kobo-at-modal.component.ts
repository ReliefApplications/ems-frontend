import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AlertModule,
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  IconModule,
  SnackbarService,
  SpinnerModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import {
  ApiConfiguration,
  CronExpressionControlModule,
  cronValidator,
  EditFormMutationResponse,
  ReadableCronModule,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Apollo } from 'apollo-angular';
import { EDIT_FORM_KOBO_PREFERENCES } from './graphql/mutations';
import { takeUntil } from 'rxjs';

/** Form and kobo information Dialog Data */
interface DialogData {
  koboId: string;
  deployedVersionId: string;
  dataFromDeployedVersion: boolean;
  apiConfiguration: ApiConfiguration;
  cronSchedule?: string;
  form: { id: string; name: string };
}

/**
 * Set a scheduled synchronization of the kobo form data (modal, schedule import data submissions from kobo)
 */
@Component({
  selector: 'app-synchronize-kobo-at-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TranslateModule,
    DialogModule,
    ToggleModule,
    AlertModule,
    IconModule,
    TooltipModule,
    ButtonModule,
    SpinnerModule,
    CronExpressionControlModule,
    ReadableCronModule,
  ],
  templateUrl: './synchronize-kobo-at-modal.component.html',
  styleUrls: ['./synchronize-kobo-at-modal.component.scss'],
})
export class SynchronizeKoboAtModalComponent extends UnsubscribeComponent {
  /** Reactive Form */
  public formGroup!: ReturnType<typeof this.createForm>;
  /** If kobo preferences were updated */
  public updated = false;
  /** Loading indicator */
  public loading = false;

  /**
   * Synchronize kobo form data (modal, import data submissions from kobo)
   *
   * @param data Data that will be passed to the dialog
   * @param fb Angular form builder
   * @param apollo Apollo service
   * @param snackBar Shared snackbar
   * @param translate Angular translate service
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {
    super();
    this.formGroup = this.createForm();
  }

  /**
   * Reset schedule synchronization to unset.
   */
  public onReset(): void {
    this.formGroup.get('cronSchedule')?.setValue('');
    this.formGroup
      .get('dataFromDeployedVersion')
      ?.setValue(this.data.dataFromDeployedVersion);
    this.formGroup.markAsDirty();
  }

  /**
   * Save the form updates
   */
  public onSave() {
    this.loading = true;
    this.apollo
      .mutate<EditFormMutationResponse>({
        mutation: EDIT_FORM_KOBO_PREFERENCES,
        variables: {
          id: this.data.form.id,
          dataFromDeployedVersion: this.formGroup.get('dataFromDeployedVersion')
            ?.value,
          cronSchedule: this.formGroup.get('cronSchedule')?.value,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ errors }) => {
          if (!errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                value: this.translate.instant(
                  'components.form.create.kobo.data.synchronizeAt'
                ),
                type: '',
              })
            );
            this.updated = true;
            this.formGroup.markAsPristine();
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotEdited', {
                type: this.translate.instant(
                  'components.form.create.kobo.data.synchronizeAt'
                ),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Create the form group
   *
   * @returns Form group
   */
  private createForm() {
    return this.fb.group({
      dataFromDeployedVersion: [this.data?.dataFromDeployedVersion ?? false],
      cronSchedule: [
        this.data?.cronSchedule ?? '',
        [Validators.required, cronValidator()],
      ],
    });
  }
}
