import { Apollo } from 'apollo-angular';
import { Component, OnInit, Input } from '@angular/core';
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
import {
  GET_FORM_BY_ID,
  GET_RESOURCE_BY_ID,
} from '../../../../graphql/queries/public-api';
import { ResourceQueryResponse } from '../../../models/resource.model';
import { FormQueryResponse } from '../../../models/form.model';

/** Component for scheduler widget */
@Component({
  selector: 'safe-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
/** Scheduler widget using KendoUI. */
export class SafeSchedulerComponent implements OnInit {
  // === SCHEDULER ===
  private currentYear = new Date().getFullYear();
  public selectedDate: Date = new Date();
  private endlessDate: Date = new Date(2100, 1, 1);

  // === DATA ===
  public events: SchedulerEvent[] = [];
  public loading = true;

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() settings: any = null;

  /**
   * Constructor of the class
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo) {}

  /** Load the data. */
  ngOnInit(): void {
    if (this.settings.source) {
      this.getRecords();
    } else {
      this.loading = false;
    }
  }

  /** Load the data, using widget parameters. */
  private getRecords(): void {
    if (!this.settings.from || this.settings.from === 'resource') {
      this.apollo
        .watchQuery<ResourceQueryResponse>({
          query: GET_RESOURCE_BY_ID,
          variables: {
            id: this.settings.source,
            display: true,
          },
        })
        .valueChanges.subscribe(({ data }) => {
          this.loading = false;
          this.events =
            data.resource?.records?.edges?.map(
              (item) =>
                ({
                  id: item.node?.id,
                  title: item.node?.data[this.settings.events.title],
                  description: this.settings.events.description
                    ? item.node?.data[this.settings.events.description]
                    : null,
                  start: item.node?.data[this.settings.events.startDate]
                    ? this.parseAdjust(
                        item.node?.data[this.settings.events.startDate]
                      )
                    : new Date(),
                  end:
                    this.settings.events.endDate &&
                    item.node?.data[this.settings.events.endDate]
                      ? this.parseAdjust(
                          item.node?.data[this.settings.events.endDate]
                        )
                      : this.endlessDate,
                } as SchedulerEvent)
            ) || [];
        });
    } else {
      this.apollo
        .watchQuery<FormQueryResponse>({
          query: GET_FORM_BY_ID,
          variables: {
            id: this.settings.source,
            display: true,
          },
        })
        .valueChanges.subscribe(({ data }) => {
          this.loading = false;
          this.events =
            data.form?.records?.map(
              (item) =>
                ({
                  id: item.id,
                  title: item.data[this.settings.events.title],
                  description: this.settings.events.description
                    ? item.data[this.settings.events.description]
                    : null,
                  start: item.data[this.settings.events.startDate]
                    ? this.parseAdjust(
                        item.data[this.settings.events.startDate]
                      )
                    : new Date(),
                  end:
                    this.settings.events.endDate &&
                    item.data[this.settings.events.endDate]
                      ? this.parseAdjust(
                          item.data[this.settings.events.endDate]
                        )
                      : this.endlessDate,
                } as SchedulerEvent)
            ) || [];
        });
    }
  }

  /**
   * Correction applied to data, to have correct format.
   *
   * @param eventDate A date as a string
   * @returns The same date transpose to the current year as Date object
   */
  private parseAdjust(eventDate: string): Date {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  }
}
