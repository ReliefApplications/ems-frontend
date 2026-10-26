import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmailService } from '../../email.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cronValidator } from '../../../../utils/validators/cron.validator';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';

/** Default cron seeded when a schedule is enabled with no saved value (every 5 minutes). */
const DEFAULT_CRON = '0/5 * 1/1 * *';

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
  /** Is current cron valid */
  public cronValid!: boolean;
  /** Schedule form group */
  public scheduleForm = this.emailService.datasetsForm?.get(
    'schedule'
  ) as FormGroup;
  /** Schedule cron form control */
  public scheduleCron!: FormControl;

  /**
   * Schedule notification configuration step.
   *
   * @param emailService Email service
   * @param snackBar Snackbar service
   * @param translate Angular translate service
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
    // A saved notification can carry an invalid cron (e.g. the editor's bogus
    // default written back onto an empty control); seed a valid one on load.
    this.seedDefaultCronIfInvalid();
    this.applyCronValidity();

    // Debounce so the snackbar doesn't fire on every keystroke.
    this.scheduleCron.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.applyCronValidity());

    this.scheduleForm
      .get('scheduleEnabled')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.seedDefaultCronIfInvalid();
        this.applyCronValidity();
      });
  }

  /**
   * Seed a valid default cron when the schedule is enabled but the current
   * expression is empty or invalid, so enabling isn't falsely blocked.
   */
  private seedDefaultCronIfInvalid(): void {
    const enabled = !!this.scheduleForm.get('scheduleEnabled')?.value;
    if (enabled && !this.scheduleCron.valid) {
      this.scheduleCron.setValue(DEFAULT_CRON);
    }
  }

  /**
   * Recompute step validity from the schedule toggle and cron control.
   */
  private applyCronValidity(): void {
    this.cronValid = this.scheduleCron.valid;
    const enabled = !!this.scheduleForm.get('scheduleEnabled')?.value;
    const invalid = enabled && !this.cronValid;
    if (invalid) {
      this.snackBar.openSnackBar(
        this.translate.instant('components.email.alert.scheduler.invalid', {}),
        { error: true }
      );
    }
    this.emailService.disableSaveAndProceed.next(invalid);
  }
}
