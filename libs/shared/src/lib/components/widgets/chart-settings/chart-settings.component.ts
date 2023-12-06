import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { createChartWidgetForm } from './chart-forms';
import { CHART_TYPES } from './constants';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../models/resource.model';
import { ReferenceData } from '../../../models/reference-data.model';
import { Apollo } from 'apollo-angular';
import { GET_REFERENCE_DATA, GET_RESOURCE } from './graphql/queries';
import { Aggregation } from '../../../models/aggregation.model';

/**
 * Chart settings component
 */
@Component({
  selector: 'shared-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss'],
})
/** Modal content for the settings of the chart widgets. */
export class ChartSettingsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Widget definition */
  @Input() widget: any;
  /** Emit the applied change */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();
  /** Widget form group */
  public formGroup!: ReturnType<typeof createChartWidgetForm>;
  /** Available chart types */
  public types = CHART_TYPES;
  /** Current chart type */
  public type: any;
  /** Current resource */
  public resource?: Resource;
  /** Loading resource */
  public loadingResource = '';
  /** Current reference data */
  public referenceData?: ReferenceData;
  /** Current aggregation */
  public aggregation?: Aggregation;

  /** @returns the form for the chart */
  public get chartForm(): UntypedFormGroup {
    return (this.formGroup?.controls.chart as UntypedFormGroup) || null;
  }

  /**
   * Chart settings component
   *
   * @param apollo Apollo service
   */
  constructor(private apollo: Apollo) {
    super();
  }

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.formGroup = createChartWidgetForm(
      this.widget.id,
      this.widget.settings
    );

    /** Makes the two data sources questions required if none is selected */
    const makeDataSourcesRequired = () => {
      const refDataCtrl = this.formGroup.controls.refData;
      const resourceCtrl = this.formGroup.controls.resource;
      if (!refDataCtrl.value && !resourceCtrl.value) {
        refDataCtrl.setValidators([Validators.required]);
        resourceCtrl.setValidators([Validators.required]);
        refDataCtrl.updateValueAndValidity();
        resourceCtrl.updateValueAndValidity();
      }
    };

    makeDataSourcesRequired();

    this.type = this.types.find((x) => x.name === this.chartForm.value.type);
    this.change.emit(this.formGroup);

    this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formGroup.markAsDirty({ onlySelf: true });
      this.change.emit(this.formGroup);
    });

    this.chartForm.controls.type.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.type = this.types.find((x) => x.name === value);
      });

    // Makes the aggregationId required when resource is selected
    this.formGroup
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value && value !== this.loadingResource) {
          // Fetch the resource details
          this.getResource(value);

          // Make (or keep) resource required
          this.formGroup.controls.resource.setValidators([Validators.required]);
          this.formGroup.controls.resource.updateValueAndValidity();

          // Make aggregationId required when resource is selected
          this.chartForm.controls.aggregationId.setValidators([
            Validators.required,
          ]);
          this.chartForm.controls.aggregationId.updateValueAndValidity();

          // Clear refData value and make it not required
          this.formGroup.controls.refData.setValue(null);
          this.formGroup.controls.refData.clearValidators();
          this.formGroup.controls.refData.updateValueAndValidity();
        } else {
          // Unset resource
          this.resource = undefined;

          // If deselecting resource, clear aggregationId value
          this.chartForm.controls.aggregationId.clearValidators();
          this.chartForm.controls.aggregationId.updateValueAndValidity();

          // If deselecting resource, make both resource and refData required
          makeDataSourcesRequired();
        }
      });

    // Clears resource when refData is selected
    this.formGroup
      .get('refData')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          // Fetch the reference data details
          this.getReferenceData(value);

          // Clear resource when refData is selected
          this.formGroup.controls.resource.setValue(null, { emitEvent: false });
          this.formGroup.controls.resource.clearValidators();
          this.formGroup.controls.resource.updateValueAndValidity();

          // Clear aggregation when refData is selected and make it not required
          this.chartForm.controls.aggregationId.setValue(null);
          this.chartForm.controls.aggregationId.clearValidators();
          this.chartForm.controls.aggregationId.updateValueAndValidity();
        } else {
          // Unset reference data
          this.referenceData = undefined;

          // If deselecting refData, make both resource and refData required
          makeDataSourcesRequired();
        }
      });

    // Initialize the resource and reference data
    if (this.formGroup.value.resource) {
      this.getResource(this.formGroup.value.resource);
    } else if (this.formGroup.value.refData) {
      this.getReferenceData(this.formGroup.value.refData);
    }
  }

  /**
   * Get a resource by id and associated aggregations
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    this.loadingResource = id;
    const aggregationId = this.formGroup.get('chart.aggregationId')?.value;
    if (id) {
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id,
            aggregationIds: aggregationId ? [aggregationId] : null,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          this.resource = data.resource;
          if (aggregationId && this.resource.aggregations?.edges[0]) {
            this.aggregation = this.resource.aggregations.edges[0].node;
          }
        });
    } else {
      this.resource = undefined;
    }
  }

  /**
   * Get a reference data by id
   *
   * @param id reference data id
   */
  private getReferenceData(id: string): void {
    this.apollo
      .query<{ referenceData: ReferenceData }>({
        query: GET_REFERENCE_DATA,
        variables: {
          id,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.referenceData = data.referenceData;
      });
  }
}
