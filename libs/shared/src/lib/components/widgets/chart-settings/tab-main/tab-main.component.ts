import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../../models/resource.model';
import { GET_REFERENCE_DATA, GET_RESOURCE } from '../graphql/queries';
import { CHART_TYPES } from '../constants';
import { Aggregation } from '../../../../models/aggregation.model';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
} from '../../../../models/reference-data.model';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { AggregationService } from '../../../../services/aggregation/aggregation.service';
import { get, isNil } from 'lodash';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';

/**
 * Main tab of chart settings modal.
 */
@Component({
  selector: 'shared-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent extends UnsubscribeComponent implements OnInit {
  /** Reactive form group */
  @Input() formGroup!: UntypedFormGroup;
  /** Selected chart type */
  @Input() type: any;
  /** Available chart types */
  public types = CHART_TYPES;
  /** Current resource */
  public resource: Resource | null = null;
  /** Current reference data */
  public referenceData: ReferenceData | null = null;
  /** Current aggregation */
  public aggregation?: Aggregation;
  /** Available fields */
  public availableSeriesFields: any[] = [];

  /**
   * Get the selected chart type object
   *
   * @returns chart type object
   */
  public get selectedChartType() {
    return (
      this.types.find(
        (type) => type.name === this.formGroup.get('chart.type')?.value
      ) ?? { name: '', icon: null }
    );
  }

  /**
   * Main tab of chart settings modal.
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param aggregationBuilder Shared aggregation builder service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private aggregationBuilder: AggregationBuilderService,
    private aggregationService: AggregationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.formGroup.get('chart.aggregationId')?.setValue(null);
          this.getResource(value);
        } else {
          this.resource = null;
        }
      });
    if (this.formGroup.value.resource) {
      this.getResource(this.formGroup.value.resource);
    }
    this.formGroup
      .get('referenceData')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.formGroup.get('chart.aggregationId')?.setValue(null);
          this.getReferenceData(value);
        } else {
          this.referenceData = null;
        }
      });
    if (this.formGroup.value.referenceData) {
      this.getReferenceData(this.formGroup.value.referenceData);
    }
  }

  /**
   * Get a resource by id and associated aggregations
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    const aggregationId = this.formGroup.get('chart.aggregationId')?.value;
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
          aggregationIds: aggregationId ? [aggregationId] : null,
        },
      })
      .subscribe({
        next: ({ data }) => {
          this.resource = data.resource;
          if (aggregationId && this.resource.aggregations?.edges[0]) {
            this.aggregation = this.resource.aggregations.edges[0].node;
            this.availableSeriesFields =
              this.aggregationBuilder.getAvailableSeriesFields(
                this.aggregation,
                {
                  resource: this.resource,
                }
              );
          } else {
            this.availableSeriesFields = [];
          }
        },
      });
  }

  /**
   * Get reference data by id
   *
   * @param id reference data id
   */
  private getReferenceData(id: string): void {
    const aggregationId = this.formGroup.get('chart.aggregationId')?.value;
    this.apollo
      .query<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id,
          aggregationIds: aggregationId ? [aggregationId] : null,
        },
      })
      .subscribe({
        next: ({ data }) => {
          this.referenceData = data.referenceData;
          if (aggregationId && this.referenceData.aggregations?.edges[0]) {
            this.aggregation = this.referenceData.aggregations.edges[0].node;
            this.availableSeriesFields =
              this.aggregationBuilder.getAvailableSeriesFields(
                this.aggregation,
                {
                  referenceData: this.referenceData,
                }
              );
          } else {
            this.availableSeriesFields = [];
          }
        },
      });
  }

  /**
   * Adds a new aggregation to the list.
   */
  public async addAggregation(): Promise<void> {
    const { AddAggregationModalComponent } = await import(
      '../../../aggregation/add-aggregation-modal/add-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations:
          get(
            this.resource ? this.resource : this.referenceData,
            'aggregations.totalCount',
            0
          ) > 0, // check if at least one existing aggregation
        resource: this.resource,
        referenceData: this.referenceData,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.formGroup.get('chart.aggregationId')?.setValue(value.id);
        this.aggregation = value;
        if (this.aggregation) {
          this.availableSeriesFields =
            this.aggregationBuilder.getAvailableSeriesFields(this.aggregation, {
              referenceData: this.referenceData,
              resource: this.resource,
            });
        } else {
          this.availableSeriesFields = [];
        }
      }
    });
  }

  /**
   * Edit chosen aggregation, in a modal. If saved, update it.
   */
  public async editAggregation(): Promise<void> {
    const { EditAggregationModalComponent } = await import(
      '../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(EditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
        referenceData: this.referenceData,
        aggregation: this.aggregation,
      },
    });
    dialogRef.closed
      .pipe(
        filter((value: any) => !isNil(value) && !isNil(this.aggregation)),
        switchMap((value: any) => {
          return this.aggregationService.editAggregation(
            this.aggregation as Aggregation,
            value,
            {
              resource: this.resource?.id,
              referenceData: this.referenceData?.id,
            }
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ data }) => {
          if (data?.editAggregation) {
            if (this.resource) {
              this.getResource(this.resource?.id as string);
            } else {
              this.getReferenceData(this.referenceData?.id as string);
            }
          }
        },
      });
  }

  /**
   * Reset given form field value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param formField Current form field
   * @param event click event
   */
  clearFormField(formField: string, event: Event) {
    if (this.formGroup.get(formField)?.value) {
      this.formGroup.get(formField)?.setValue(null);
    }
    event.stopPropagation();
  }
}
