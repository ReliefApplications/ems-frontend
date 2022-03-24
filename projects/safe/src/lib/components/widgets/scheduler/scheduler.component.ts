import { Component, OnInit, Input } from '@angular/core';
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { MOCKED_EVENTS } from './MOCK_EVENTS';

/**
 * Scheduler widget using KendoUI.
 */
@Component({
  selector: 'safe-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SafeSchedulerComponent implements OnInit {
  // === SCHEDULER ===
  public selectedDate: Date = new Date();

  // === DATA ===
  public events: SchedulerEvent[] = [];
  public loading = true;

  // === TIME CONFIG ===
  public startTime = '06:00';
  public endTime = '19:00';
  public workStartTime = '08:00';
  public workEndTime = '18:00';

  // === WIDGET CONFIGURATION ===
  @Input() settings: any = null;

  /**
   * Init the widget.
   */
  ngOnInit(): void {
    this.events = MOCKED_EVENTS;
    this.configSetup();
    this.loading = false;
    console.log(this.settings);
  }

  configSetup(): void {
    // Setting up time configuration
    if (this.settings) {
      const { startTime, endTime, workStartTime, workEndTime } = this.settings;

      this.startTime = startTime ? startTime : this.startTime;
      this.endTime = endTime ? endTime : this.endTime;
      this.workStartTime = workStartTime ? workStartTime : this.workStartTime;
      this.workEndTime = workEndTime ? workEndTime : this.workEndTime;
    }

    // Other configs
  }
}
