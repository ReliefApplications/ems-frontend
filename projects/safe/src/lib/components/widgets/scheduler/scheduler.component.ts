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
  public startTime = '';
  public endTime = '';
  public workStartTime = '';
  public workEndTime = '';

  // === WIDGET CONFIGURATION ===
  @Input() settings: any = null;

  /**
   * Init the widget.
   */
  ngOnInit(): void {
    this.events = MOCKED_EVENTS;
    this.configSetup();
    this.loading = false;
  }

  configSetup(): void {
    // Setting up time configuration
    if (this.settings) {
      const { startTime, endTime, workStartTime, workEndTime } = this.settings!.times;

      this.startTime = startTime;
      this.endTime = endTime;
      this.workStartTime = workStartTime;
      this.workEndTime = workEndTime;
    }

    // Other configs
  }
}
