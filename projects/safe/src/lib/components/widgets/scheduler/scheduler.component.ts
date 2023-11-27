import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  SchedulerComponent,
  SchedulerEvent,
} from '@progress/kendo-angular-scheduler';
import { MOCKED_EVENTS } from './MOCK_EVENTS';

const DEFAULT_FILE_NAME = 'scheduler';

/**
 * Scheduler widget using KendoUI.
 */
@Component({
  selector: 'safe-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SafeSchedulerComponent implements OnInit, AfterViewInit {
  // === SCHEDULER ===
  public selectedDate: Date = new Date();
  @ViewChild(SchedulerComponent) public scheduler!: SchedulerComponent;

  // === DATA ===
  public events: SchedulerEvent[] = [];
  public loading = true;

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() settings: any = {
    title: this.translate.instant('widgets.scheduler.new'),
  };

  public fileName = DEFAULT_FILE_NAME;

  constructor(private translate: TranslateService) {}

  /** Init the widget */
  ngOnInit(): void {
    this.events = MOCKED_EVENTS;
    this.loading = false;
  }

  /** Listen to scheduler events */
  ngAfterViewInit(): void {
    this.setFileName();
    this.scheduler.dateChange.subscribe(() => this.setFileName());
  }

  /** Set file name from current date / view */
  private setFileName(): void {
    const currentView = this.scheduler.selectedView.name;
    const currentDate = this.scheduler.selectedDate;
    switch (currentView) {
      case 'day': {
        this.fileName = `${currentDate.toLocaleString('en-us', {
          month: 'short',
          day: 'numeric',
        })} ${currentDate.getFullYear()}`;
        break;
      }
      case 'week': {
        const first = currentDate.getDate() - currentDate.getDay();
        const last = first + 6;
        const firstDay = new Date(currentDate.setDate(first));
        const lastDay = new Date(currentDate.setDate(last));
        this.fileName = `${firstDay.toLocaleString('en-us', {
          month: 'short',
          day: 'numeric',
        })} ${firstDay.getFullYear()} - ${lastDay.toLocaleString('en-us', {
          month: 'short',
          day: 'numeric',
        })} ${lastDay.getFullYear()}`;
        break;
      }
      case 'month': {
        this.fileName = `${currentDate.toLocaleString('en-us', {
          month: 'long',
        })} ${currentDate.getFullYear()}`;
        break;
      }
      case 'timeline': {
        this.fileName = `${currentDate.toLocaleString('en-us', {
          month: 'short',
          day: 'numeric',
        })} ${currentDate.getFullYear()}`;
        break;
      }
      default: {
        this.fileName = DEFAULT_FILE_NAME;
        break;
      }
    }
  }

  /**
   * Checks if an event already ended.
   */
  eventEnded(event: { end: string; [key: string]: any }) {
    const eventTime = new Date(event.end);
    const now = new Date();

    return now > eventTime;
  }

  /**
   * Exports the scheduler as a pdf.
   */
  public exportPDF() {
    this.scheduler?.saveAsPDF();
    return;
  }
}
