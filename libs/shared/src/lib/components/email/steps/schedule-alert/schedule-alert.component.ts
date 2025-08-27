import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmailService } from '../../email.service';
import { FormControl, FormGroup } from '@angular/forms';

/**
 * Schedule notification configuration step.
 */
@Component({
  selector: 'app-schedule-alert',
  templateUrl: './schedule-alert.component.html',
  styleUrls: ['./schedule-alert.component.scss'],
})
export class ScheduleAlertComponent implements OnInit, OnDestroy {
  /** Flag indicating whether schedule alert is enabled. */
  schedule_alert = false;
  /** Is current cron valid */
  public cronValid!: boolean;
  /** Schedule form group */
  public scheduleForm = this.emailService.datasetsForm?.get(
    'schedule'
  ) as FormGroup;
  /** Schedule cron form control */
  public scheduleCron: FormControl = new FormControl();

  /**
   * Schedule notification configuration step.
   *
   *@param emailService is injecting email service to this component
   */
  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.scheduleCron = this.scheduleForm.get('cronValue') as FormControl;
  }

  /**
   * Is current cron value valid
   *
   * @param value is valid boolean
   */
  public cronIsValid(value: boolean) {
    this.cronValid = value;
  }

  ngOnDestroy() {
    console.log('Schedule alert destroyed', this.scheduleForm);
  }
}
