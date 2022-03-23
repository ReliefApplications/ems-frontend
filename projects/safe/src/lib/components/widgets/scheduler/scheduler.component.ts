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

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() settings: any = null;

  /**
   * Init the widget.
   */
  ngOnInit(): void {
    this.events = MOCKED_EVENTS;
    this.loading = false;
  }
}
