import { Component, OnInit } from '@angular/core';
import { EmailService } from '../../email.service';

/**
 * schedule-alert page component.
 */
@Component({
  selector: 'app-schedule-alert',
  templateUrl: './schedule-alert.component.html',
  styleUrls: ['./schedule-alert.component.scss'],
})
export class ScheduleAlertComponent implements OnInit {
  /** Flag indicating whether schedule alert is enabled. */
  schedule_alert = true;

  /**
   * initialing this component
   *
   *@param emailService is injecting email service to this component
   */
  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    if (this.schedule_alert) {
      this.emailService.disableSaveAndProceed.next(false);
    }
  }
}
