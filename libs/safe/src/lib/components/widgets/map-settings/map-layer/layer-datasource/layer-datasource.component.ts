import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { takeUntil } from 'rxjs';
import { Resource } from '../../../../../models/resource.model';
import { ReferenceData } from '../../../../../models/reference-data.model';
import { Aggregation } from '../../../../../models/aggregation.model';
import { Layout } from '../../../../../models/layout.model';
import { SafeUnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import {
  GetResourcesQueryResponse,
  GetResourceQueryResponse,
  GetReferenceDatasQueryResponse,
  GetReferenceDataQueryResponse,
  GET_RESOURCES,
  GET_RESOURCE,
  GET_REFERENCE_DATAS,
  GET_REFERENCE_DATA,
} from '../../graphql/queries';
import { SafeGraphQLSelectComponent } from '../../../../graphql-select/graphql-select.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AddLayoutModalComponent } from '../../../../grid-layout/add-layout-modal/add-layout-modal.component';
import { get } from 'lodash';
import { AddAggregationModalComponent } from '../../../../aggregation/add-aggregation-modal/add-aggregation-modal.component';
import { SafeEditLayoutModalComponent } from '../../../../grid-layout/edit-layout-modal/edit-layout-modal.component';
import { SafeGridLayoutService } from '../../../../../services/grid-layout/grid-layout.service';
import { SafeAggregationService } from '../../../../../services/aggregation/aggregation.service';
import { SafeEditAggregationModalComponent } from '../../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { AggregationBuilderService } from '../../../../../services/aggregation-builder/aggregation-builder.service';
import { QueryBuilderService } from '../../../../../services/query-builder/query-builder.service';

/** Default items per resources query, for pagination */
const ITEMS_PER_PAGE = 10;

/** Component for the layer datasource selection tab */
@Component({
  selector: 'safe-layer-datasource',
  templateUrl: './layer-datasource.component.html',
  styleUrls: ['./layer-datasource.component.scss'],
})
export class LayerDatasourceComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;
  public origin!: FormControl<string | null>;

  // Resource
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public resource: Resource | null = null;
  @ViewChild(SafeGraphQLSelectComponent)
  resourceSelect?: SafeGraphQLSelectComponent;

  // Reference data
  public refDatasQuery!: QueryRef<GetReferenceDatasQueryResponse>;
  public refData: ReferenceData | null = null;
  @ViewChild(SafeGraphQLSelectComponent)
  refDataSelect?: SafeGraphQLSelectComponent;

  // Aggregation and layout
  public aggregation: Aggregation | null = null;
  public layout: Layout | null = null;

  // todo(gis): type
  public fields: any[] = [];

  /**
   * Component for the layer datasource selection tab
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param gridLayoutService Shared layout service
   * @param aggregationService Shared aggregation service
   * @param queryBuilder Query builder service
   * @param aggregationBuilder Aggregation builder service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private gridLayoutService: SafeGridLayoutService,
    private aggregationService: SafeAggregationService,
    private queryBuilder: QueryBuilderService,
    private aggregationBuilder: AggregationBuilderService
  ) {
    super();
  }

  ngOnInit(): void {
    // Set origin form control
    if (this.formGroup.value.resource) {
      this.origin = new FormControl('resource');
    } else {
      if (this.formGroup.value.refData) {
        this.origin = new FormControl('refData');
      } else {
        this.origin = new FormControl();
      }
    }
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });

    this.refDatasQuery = this.apollo.watchQuery<GetReferenceDatasQueryResponse>(
      {
        query: GET_REFERENCE_DATAS,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      }
    );

    // If the form has a resource, fetch it
    const resourceID = this.formGroup.get('resource')?.value;
    if (resourceID) {
      const layoutID = this.formGroup.value.datasource?.layout;
      const aggregationID = this.formGroup.value.datasource?.aggregation;
      this.apollo
        .query<GetResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id: resourceID,
            layout: layoutID ? [layoutID] : undefined,
            aggregation: aggregationID ? [aggregationID] : undefined,
          },
        })
        .subscribe(({ data }) => {
          this.resource = data.resource;

          if (layoutID) {
            this.layout = data.resource.layouts?.edges[0]?.node || null;
            this.fields = get(this.layout, 'query.fields', []);
          }
          if (aggregationID) {
            this.aggregation =
              data.resource.aggregations?.edges[0]?.node || null;
            this.fields = this.getAggregationFields();
          }
        });
    }

    // Listen to origin changes
    this.origin.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.resource = null;
      this.refData = null;
      this.formGroup.patchValue({ resource: null, refData: null });
    });

    // Listen to resource changes
    this.formGroup
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((resourceID) => {
        this.resource =
          this.resourceSelect?.elements
            .getValue()
            .find((x) => x.id === resourceID) || null;

        this.formGroup.get('layout')?.setValue(null);
        this.formGroup.get('aggregation')?.setValue(null);
        this.layout = null;
        this.aggregation = null;
      });

    // If form has a refData, fetch it
    const refDataID = this.formGroup.get('refData')?.value;
    if (refDataID) {
      this.apollo
        .query<GetReferenceDataQueryResponse>({
          query: GET_REFERENCE_DATA,
          variables: {
            id: refDataID,
          },
        })
        .subscribe(({ data }) => {
          this.refData = data.referenceData;
        });
    }

    // Listen to refData changes
    this.formGroup
      .get('refData')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((refDataID) => {
        this.refData =
          this.refDataSelect?.elements
            .getValue()
            .find((x) => x.id === refDataID) || null;
      });
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  onResourceSearchChange(search: string): void {
    this.resourcesQuery.refetch({
      first: ITEMS_PER_PAGE,
      sortField: 'name',
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

  /** Opens modal for layout selection/creation */
  public selectLayout() {
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.resource,
        hasLayouts: get(this.resource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.formGroup.get('layout')?.setValue(value.id);
        this.layout = value;
        this.fields = get(this.layout, 'query.fields', []);
      }
    });
  }

  /** Opens modal for aggregation selection/creation */
  selectAggregation(): void {
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations: get(this.resource, 'aggregations.totalCount', 0) > 0,
        resource: this.resource,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.formGroup.get('aggregation')?.setValue(value.id);
        this.aggregation = value;
        this.fields = this.getAggregationFields();
      }
    });
  }

  /**
   * Edit chosen layout, in a modal. If saved, update it.
   */
  public editLayout(): void {
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout: this.layout,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value && this.layout) {
        this.gridLayoutService
          .editLayout(this.layout, value, this.resource?.id)
          .subscribe((res: any) => {
            this.layout = get(res, 'data.editLayout', null);
            this.fields = get(this.layout, 'query.fields', []);
          });
      }
    });
  }

  /**
   * Edit chosen aggregation, in a modal. If saved, update it.
   */
  public editAggregation(): void {
    const dialogRef = this.dialog.open(SafeEditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
        aggregation: this.aggregation,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value && this.aggregation) {
        this.aggregationService
          .editAggregation(this.aggregation, value, this.resource?.id)
          .subscribe((res) => {
            this.aggregation = get(res, 'data.editAggregation', null);
            this.fields = this.getAggregationFields();
          });
      }
    });
  }

  /**
   * Get fields from aggregation
   *
   * @returns aggregation fields
   */
  private getAggregationFields() {
    //@TODO this part should be refactored
    // Get fields
    const fields = this.getAvailableSeriesFields();
    const selectedFields = this.aggregation?.sourceFields
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
              .filter((y) => y.type.name !== 'ID' && y.type.kind === 'SCALAR'),
          });
        }
        return field;
      })
      // @TODO To be improved - Get only the JSON type fields for this case
      .filter((x: any) => x !== null && x.type.name === 'JSON');

    return this.aggregationBuilder.fieldsAfter(
      selectedFields,
      this.aggregation?.pipeline
    );
  }

  // @TODO Copied method from tab-main.component, this one should be refactored in the needed places
  // eslint-disable-next-line jsdoc/require-returns
  /**
   * Set available series fields, from resource fields and aggregation definition.
   */
  private getAvailableSeriesFields(): any[] {
    return this.queryBuilder
      .getFields(this.resource?.queryName as string)
      .filter(
        (field: any) =>
          !(
            field.name.includes('_id') &&
            (field.type.name === 'ID' ||
              (field.type.kind === 'LIST' && field.type.ofType.name === 'ID'))
          )
      );
  }
}
