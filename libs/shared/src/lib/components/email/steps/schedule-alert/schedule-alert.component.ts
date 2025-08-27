import { Component, OnInit } from '@angular/core';
import { EmailService } from '../../email.service';
import { FormControl } from '@angular/forms';

/**
 * Schedule notification configuration step.
 */
@Component({
  selector: 'app-schedule-alert',
  templateUrl: './schedule-alert.component.html',
  styleUrls: ['./schedule-alert.component.scss'],
})
export class ScheduleAlertComponent implements OnInit {
  /** Flag indicating whether schedule alert is enabled. */
  schedule_alert = false;
  /** Is current cron valid */
  public cronValid!: boolean;
  /** Cron expression form control */
  public control: FormControl = new FormControl();

  /**
   * Schedule notification configuration step.
   *
   *@param emailService is injecting email service to this component
   */
  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    // For phase 1, skip this part
    if (!this.schedule_alert) {
      this.emailService.disableSaveAndProceed.next(false);
    }
  }

  /**
   * Is current cron valud
   *
   * @param value is valid boolean
   */
  public cronIsValid(value: boolean) {
    this.cronValid = value;
  }
}
