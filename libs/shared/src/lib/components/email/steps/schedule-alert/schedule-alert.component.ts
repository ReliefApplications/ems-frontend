import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmailService } from '../../email.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cronValidator } from '../../../../utils/validators/cron.validator';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';

/**
 * Schedule notification configuration step.
 */
@Component({
  selector: 'app-schedule-alert',
  templateUrl: './schedule-alert.component.html',
  styleUrls: ['./schedule-alert.component.scss'],
})
export class ScheduleAlertComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Flag indicating whether schedule alert is enabled. */
  schedule_alert = false;
  /** Is current cron valid */
  public cronValid!: boolean;
  /** Schedule form group */
  public scheduleForm = this.emailService.datasetsForm?.get(
    'schedule'
  ) as FormGroup;
  /** Schedule cron form control */
  public scheduleCron: FormControl = new FormControl('', [
    Validators.required,
    cronValidator(),
  ]);

  /**
   * Schedule notification configuration step.
   *
   *@param emailService is injecting email service to this component
   *@param snackBar is injecting snackbar service to this component
   *@param translate is injecting translate service to this component
   */
  constructor(
    private emailService: EmailService,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.scheduleCron = this.scheduleForm.get('cronValue') as FormControl;
    this.scheduleCron.setValidators([Validators.required, cronValidator()]);
    this.scheduleCron.updateValueAndValidity();
    this.cronValid = this.scheduleCron.valid;
    this.emailService.disableSaveAndProceed.next(
      !!this.scheduleForm.get('scheduleEnabled')?.value &&
        !this.scheduleCron.valid
    );

    this.scheduleCron.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cronValid = this.scheduleCron.valid;
        if (!this.cronValid) {
          this.scheduleCron.setErrors({ invalid: true });
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.email.alert.scheduler.invalid',
              {}
            ),
            { error: true }
          );
          this.emailService.disableSaveAndProceed.next(true);
        } else {
          this.emailService.disableSaveAndProceed.next(false);
        }
      });

    this.scheduleForm
      .get('scheduleEnabled')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value && (!this.scheduleCron.value || !this.cronValid)) {
          this.scheduleCron.setErrors({ invalid: true });
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.email.alert.scheduler.invalid',
              {}
            ),
            { error: true }
          );
          this.emailService.disableSaveAndProceed.next(true);
        } else {
          this.emailService.disableSaveAndProceed.next(false);
        }
      });
  }

  /**
   * Is current cron value valid
   *
   * @param value is valid boolean
   */
  public cronIsValid(value: boolean) {
    this.cronValid = value;
  }
}
