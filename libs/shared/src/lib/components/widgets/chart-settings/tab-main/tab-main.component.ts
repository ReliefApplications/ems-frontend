import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../../models/resource.model';
import {
  GET_REFERENCE_DATA,
  GET_RESOURCE,
  GET_RESOURCES,
  GET_REFERENCE_DATAS,
} from '../graphql/queries';
import { Subject } from 'rxjs';
import { CHART_TYPES } from '../constants';
import { Aggregation } from '../../../../models/aggregation.model';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { AggregationService } from '../../../../services/aggregation/aggregation.service';
import { get } from 'lodash';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
} from '../../../../models/reference-data.model';

/**
 * Main tab of chart settings modal.
 */
@Component({
  selector: 'shared-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent extends UnsubscribeComponent implements OnInit {
  @Input() formGroup!: UntypedFormGroup;
  @Input() type: any;
  public types = CHART_TYPES;
  public resource!: Resource | null;
  public referenceData!: ReferenceData | null;
  public aggregation!: Aggregation | null;
  public availableSeriesFields: any[] = [];

  private reload = new Subject<boolean>();
  public reload$ = this.reload.asObservable();
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

  getResources = GET_RESOURCES;
  getReferenceDatas = GET_REFERENCE_DATAS;

  /**
   * Main tab of chart settings modal.
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param aggregationBuilder Shared aggregation builder service
   * @param queryBuilder Shared query builder service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private aggregationBuilder: AggregationBuilderService,
    private queryBuilder: QueryBuilderService,
    private aggregationService: AggregationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup
      .get('chart.type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.reload.next(true);
      });
    this.formGroup
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.getResource(value);
          this.formGroup.get('referenceData')?.setValue(null);
        } else {
          this.resource = value;
        }
        this.formGroup.get('aggregation')?.setValue(null);
      });
    if (this.formGroup.value.resource) {
      this.getResource(this.formGroup.value.resource);
    }
    this.formGroup
      .get('referenceData')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.getReferenceData(value);
          this.formGroup.get('resource')?.setValue(null);
        } else {
          this.referenceData = value;
        }
        this.formGroup.get('aggregation')?.setValue(null);
      });
    this.formGroup
      .get('aggregation')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (!data) {
          this.aggregation = null;
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
    const aggregationId = this.formGroup.get('aggregation')?.value;
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
          this.setAvailableSeriesFields();
        }
      });
  }

  /**
   * Get a reference data by id
   *
   * @param id reference data id
   */
  private getReferenceData(id: string): void {
    const aggregationId = this.formGroup.get('aggregation')?.value;
    this.apollo
      .query<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id,
          aggregationIds: aggregationId ? [aggregationId] : null,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.referenceData = data.referenceData;
        if (aggregationId && this.referenceData.aggregations?.edges[0]) {
          this.aggregation = this.referenceData.aggregations.edges[0].node;
          this.setAvailableSeriesFields();
        }
      });
  }

  /**
   * Set available series fields, from resource fields and aggregation definition.
   */
  private setAvailableSeriesFields(): void {
    if (this.aggregation) {
      const source = this.resource ?? this.referenceData;
      const type = this.resource ? 'resource' : 'referenceData';
      const queryName = this.aggregationService.setCurrentSourceQueryName(
        source,
        type
      );
      const fields = this.queryBuilder
        .getFields(queryName as string)
        .filter(
          (field: any) =>
            !(
              field.name.includes('_id') &&
              (field.type.name === 'ID' ||
                (field.type.kind === 'LIST' && field.type.ofType.name === 'ID'))
            )
        );
      const selectedFields = this.aggregation.sourceFields
        .map((x: string) => {
          const field = fields.find((y) => x === y.name);
          if (!field) {
            return null;
          }
          if (field.type.kind !== 'SCALAR') {
            Object.assign(field, {
              fields: this.queryBuilder.deconfineFields(
                field.type,
                new Set().add(this.resource?.name).add(field.type.ofType?.name)
              ),
            });
          }
          return field;
        })
        .filter((x: any) => x !== null);
      this.availableSeriesFields = this.aggregationBuilder.fieldsAfter(
        selectedFields,
        this.aggregation?.pipeline
      );
    } else {
      this.availableSeriesFields = [];
    }
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
            this.resource ?? this.referenceData,
            'aggregations.totalCount',
            0
          ) > 0, // check if at least one existing aggregation
        resource: this.resource,
        referenceData: this.referenceData,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.formGroup.get('aggregation')?.setValue(value.id);
        this.aggregation = value;
        this.setAvailableSeriesFields();
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
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && this.aggregation) {
        const id = this.resource?.id ?? this.referenceData?.id;
        const type = this.resource?.id ? 'resource' : 'referenceData';
        this.aggregationService
          .editAggregation(this.aggregation, value, id, type)
          .pipe(takeUntil(this.destroy$))
          .subscribe(({ data }) => {
            if (data?.editAggregation) {
              if (this.resource) {
                this.getResource(this.resource.id as string);
              }
              if (this.referenceData) {
                this.getReferenceData(this.referenceData.id as string);
              }
            }
          });
      }
    });
  }
}
