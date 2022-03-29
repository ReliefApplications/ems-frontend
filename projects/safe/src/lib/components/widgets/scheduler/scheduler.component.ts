import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SchedulerEvent } from "@progress/kendo-angular-scheduler";
import { MOCKED_EVENTS } from './MOCK_EVENTS';
import { SafeDownloadService } from '../../../services/download.service';

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
  @ViewChild("scheduler") public scheduler: any;

  // === DATA ===
  public events: SchedulerEvent[] = [];
  public loading = true;

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() settings: any = null;

  constructor(public downloadService: SafeDownloadService) {}

  /**
   * Init the widget.
   */
  ngOnInit(): void {
    this.events = MOCKED_EVENTS;
    this.loading = false;
  }

  /**
   * Exports the scheduler as a pdf.
   */
  public exportPDF() {
    this.scheduler?.saveAsPDF();
    return;
  }
}
