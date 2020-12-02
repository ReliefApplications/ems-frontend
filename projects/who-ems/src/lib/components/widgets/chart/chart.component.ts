import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GetResourceByIdQueryResponse, GET_RESOURCE_BY_ID, GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../../graphql/queries';
import { saveAs } from '@progress/kendo-file-saver';
import { ChartComponent } from '@progress/kendo-angular-charts';
import { Subscription } from 'rxjs';
import { RecordAddedSubscriptionResponse, RECORD_ADDED_SUBSCRIPTION } from '../../../graphql/subscriptions';

@Component({
  selector: 'who-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
/*  Chart widget using KendoUI.
*/
export class WhoChartComponent implements OnChanges, OnDestroy {

  // === DATA ===
  public loading = true;
  public data = [];
  private recordsSubscription: Subscription;

  // === WIDGET CONFIGURATION ===
  @Input() settings: any = null;

  // === EXPORT ===
  private fileName = 'chart.png';

  // === CHART ===
  @ViewChild('chart')
  private chart: ChartComponent;

  constructor( private apollo: Apollo ) {
  }

  /*  Detect changes of the settings to reload the data.
  */
  ngOnChanges(): void {
    if (this.settings.source) {
      this.getRecords();
    } else {
      this.loading = false;
    }
  }

  public onExport(): void {
    this.chart.exportImage({
      width: 1200,
      height: 800
    }).then((dataURI) => {
      saveAs(dataURI, this.fileName);
    });
  }

  /*  Load the data, using widget parameters.
  */
  private getRecords(): void {
    if (!this.settings.from || this.settings.from === 'resource') {
      const recordsQuery = this.apollo.watchQuery<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: this.settings.source,
          display: true
        }
      });

      this.recordsSubscription = recordsQuery.valueChanges.subscribe(res => {
        this.data = [];
        const dataToAggregate = [];
        if (res.data.resource){
          this.fileName = `${res.data.resource.name}.png`;
          for (const record of res.data.resource.records) {
            const existingField = dataToAggregate.find(x => x[this.settings.xAxis] === record.data[this.settings.xAxis]);
            if (existingField) {
              existingField[this.settings.yAxis] += record.data[this.settings.yAxis];
            } else {
              dataToAggregate.push(record.data);
            }
          }
        }
        this.data = dataToAggregate;
        this.loading = res.loading;
      });

      recordsQuery.subscribeToMore<RecordAddedSubscriptionResponse>({
        document: RECORD_ADDED_SUBSCRIPTION,
        variables: {
          resource: this.settings.source
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }
          const newRecord = subscriptionData.data.recordAdded;
          return {
            ...prev,
            resource: {
              ...prev.resource,
              records: [newRecord, ...prev.resource.records]
            }
          };
        }
      });
    } else {
      const recordsQuery = this.apollo.watchQuery<GetFormByIdQueryResponse>({
        query: GET_FORM_BY_ID,
        variables: {
          id: this.settings.source,
          display: true
        }
      });

      this.recordsSubscription = recordsQuery.valueChanges.subscribe(res => {
        this.data = [];
        const dataToAggregate = [];
        if (res.data.form){
          this.fileName = `${res.data.form.name}.png`;
          for (const record of res.data.form.records) {
            const existingField = dataToAggregate.find(x => x[this.settings.xAxis] === record.data[this.settings.xAxis]);
            if (existingField) {
              existingField[this.settings.yAxis] += record.data[this.settings.yAxis];
            } else {
              dataToAggregate.push(record.data);
            }
          }
        }
        this.data = dataToAggregate;
        this.loading = res.loading;
      });

      recordsQuery.subscribeToMore<RecordAddedSubscriptionResponse>({
        document: RECORD_ADDED_SUBSCRIPTION,
        variables: {
          form: this.settings.source
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }
          const newRecord = subscriptionData.data.recordAdded;
          return {
            ...prev,
            form: {
              ...prev.form,
              records: [newRecord, ...prev.form.records]
            }
          };
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.recordsSubscription) {
      this.recordsSubscription.unsubscribe();
    }
  }
}
