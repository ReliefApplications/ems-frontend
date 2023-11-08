import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { createChartWidgetForm } from './chart-forms';
import { CHART_TYPES } from './constants';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { Apollo } from 'apollo-angular';
import { ResourceQueryResponse } from '../../../models/resource.model';
import { GET_RESOURCE_METADATA } from '../summary-card/graphql/queries';

/**
 * Chart settings component
 */
@Component({
  selector: 'shared-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss'],
})
/** Modal content for the settings of the chart widgets. */
export class ChartSettingsComponent implements OnInit {
  // === REACTIVE FORM ===
  public formGroup!: UntypedFormGroup;

  // === WIDGET ===
  @Input() widget: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === DATA ===
  public types = CHART_TYPES;
  public type: any;
  public dataFilter: any;

  // === DISPLAY PREVIEW ===
  public settings: any;
  public grid: any;

  /**
   * The constructor function
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo) {}

  /** @returns the form for the chart */
  public get chartForm(): UntypedFormGroup {
    return (this.formGroup?.controls.chart as UntypedFormGroup) || null;
  }

  /** Stores the selected tab */
  public selectedTab = 0;

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.formGroup = extendWidgetForm(
      createChartWidgetForm(this.widget.id, this.widget.settings),
      this.widget.settings?.widgetDisplay
    );
    this.type = this.types.find((x) => x.name === this.chartForm.value.type);
    this.change.emit(this.formGroup);

    this.formGroup?.valueChanges.subscribe(() => {
      this.change.emit(this.formGroup);
    });

    this.chartForm.controls.type.valueChanges.subscribe((value) => {
      this.type = this.types.find((x) => x.name === value);
    });

    this.getQueryMetaData();
  }

  /**
   * Gets query metadata for grid settings, from the query name
   */
  private getQueryMetaData(): void {
    if (this.formGroup.get('resource')?.value) {
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE_METADATA,
          variables: {
            id: this.formGroup.get('resource')?.value,
          },
        })
        .subscribe(({ data }) => {
          if (data.resource && data.resource.queryName) {
            const nameTrimmed = data.resource.queryName
              .replace(/\s/g, '')
              .toLowerCase();
            this.dataFilter = {
              form: !this.formGroup.get('contextFilters')
                ? null
                : JSON.parse(this.formGroup.get('contextFilters')?.value),
              resourceName: nameTrimmed,
            };
          }
        });
    }
  }

  /**
   *  Handles the a tab change event
   *
   * @param event Event triggered on tab switch
   */
  handleTabChange(event: number): void {
    this.selectedTab = event;
  }
}
