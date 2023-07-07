import { Component, Input, OnInit } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { Resource } from '../../../../models/resource.model';
import { ReferenceData } from '../../../../models/reference-data.model';
import { Subject } from 'rxjs';
import { CHART_TYPES } from '../constants';
import {
  GetResourceByIdQueryResponse,
  GetResourcesQueryResponse,
  GetReferenceDatasQueryResponse,
  GetReferenceDataByIdQueryResponse,
  GET_RESOURCE,
  GET_RESOURCES,
  GET_REFERENCE_DATAS,
  GET_REFERENCE_DATA,
} from '../graphql/queries';
import { Aggregation } from '../../../../models/aggregation.model';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { SafeAggregationService } from '../../../../services/aggregation/aggregation.service';
import { get } from 'lodash';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Main tab of chart settings modal.
 */
@Component({
  selector: 'safe-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() formGroup!: UntypedFormGroup;
  @Input() type: any;
  public origin!: FormControl<string | null>;
  public types = CHART_TYPES;
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public resource?: Resource | null;
  public referenceDatasQuery!: QueryRef<GetReferenceDatasQueryResponse>;
  public referenceData?: ReferenceData | null;
  public aggregation?: Aggregation;
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
    private aggregationService: SafeAggregationService
  ) {
    super();
  }

  ngOnInit(): void {
    // Set origin form control
    if (this.formGroup.value.resource) {
      this.origin = new FormControl('resource');
    } else {
      if (this.formGroup.value.referenceData) {
        this.origin = new FormControl('referenceData');
      } else {
        this.origin = new FormControl();
      }
    }
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
          this.formGroup.get('chart.aggregationId')?.setValue(null);
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
          this.getReferenceData(value);
          this.formGroup.get('chart.aggregationId')?.setValue(null);
        }
      });
    if (this.formGroup.value.referenceData) {
      this.getReferenceData(this.formGroup.value.referenceData);
    }
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
    this.referenceDatasQuery =
      this.apollo.watchQuery<GetReferenceDatasQueryResponse>({
        query: GET_REFERENCE_DATAS,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      });
    // Listen to origin changes
    this.origin.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.resource = null;
      this.referenceData = null;
      this.formGroup.patchValue({ resource: null, refData: null });
    });
  }

  /**
   * Get a resource by id and associated aggregations
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    const aggregationId = this.formGroup.get('chart.aggregationId')?.value;
    this.apollo
      .query<GetResourceByIdQueryResponse>({
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
    const aggregationId = this.formGroup.get('chart.aggregationId')?.value;
    this.apollo
      .query<GetReferenceDataByIdQueryResponse>({
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
      const queryName = this.resource
        ? this.resource.queryName
        : (this.referenceData?.name as string).replace(/^\w/, (match) =>
            match.toUpperCase()
          ) + 'Ref';
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
          if (!field) return null;
          if (field.type.kind !== 'SCALAR') {
            Object.assign(field, {
              fields: this.queryBuilder
                .getFieldsFromType(
                  field.type.kind === 'OBJECT'
                    ? field.type.name
                    : field.type.ofType.name
                )
                .filter(
                  (y) => y.type.name !== 'ID' && y.type.kind === 'SCALAR'
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
          get(this.resource, 'aggregations.totalCount', 0) > 0 ||
          get(this.referenceData, 'aggregations.totalCount', 0) > 0, // check if at least one existing aggregation
        resource: this.resource,
        referenceData: this.referenceData,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.formGroup.get('chart.aggregationId')?.setValue(value.id);
        this.aggregation = value;
        this.setAvailableSeriesFields();
      }
    });
  }

  /**
   * Edit chosen aggregation, in a modal. If saved, update it.
   */
  public async editAggregation(): Promise<void> {
    const { SafeEditAggregationModalComponent } = await import(
      '../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(SafeEditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
        referenceData: this.referenceData,
        aggregation: this.aggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && this.aggregation) {
        this.aggregationService
          .editAggregation(
            this.aggregation,
            value,
            this.resource?.id,
            this.referenceData?.id
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe(({ data }) => {
            if (data?.editAggregation) {
              if (this.resource) this.getResource(this.resource.id as string);
              if (this.referenceData)
                this.getReferenceData(this.referenceData.id as string);
            }
          });
      }
    });
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  public onResourceSearchChange(search: string): void {
    const variables = this.resourcesQuery.variables;
    this.resourcesQuery.refetch({
      ...variables,
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: search,
          },
        ],
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
