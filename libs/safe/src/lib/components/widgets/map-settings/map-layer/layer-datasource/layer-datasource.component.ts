import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { pairwise, takeUntil } from 'rxjs';
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
import { LayerFormT } from '../../map-forms';
import { SafeGraphQLSelectComponent } from '../../../../graphql-select/graphql-select.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AddLayoutModalComponent } from '../../../../grid-layout/add-layout-modal/add-layout-modal.component';
import { get } from 'lodash';
import { AddAggregationModalComponent } from '../../../../aggregation/add-aggregation-modal/add-aggregation-modal.component';
import { SafeEditLayoutModalComponent } from '../../../../grid-layout/edit-layout-modal/edit-layout-modal.component';
import { SafeGridLayoutService } from '../../../../../services/grid-layout/grid-layout.service';
import { SafeAggregationService } from '../../../../../services/aggregation/aggregation.service';
import { SafeEditAggregationModalComponent } from '../../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DataSourceChangeEvent } from './layer-datasource.interfaces';

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
  @Input() form!: LayerFormT;

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
  fieldList = ['geoField', 'latitudeField', 'longitudeField'] as const;

  /**
   * Get fields from datasource
   *
   * @returns fields of datasource
   */
  get fieldData() {
    // If the field form is disabled it will return an undefined value for it
    // Because we are extracting these properties from value, not rawValue()
    const { geoField, latitudeField, longitudeField } = this.form.get(
      'datasource'
    )?.value as any;
    return {
      geoField,
      latitudeField,
      longitudeField,
    };
  }

  // Output
  @Output() fieldsChange = new EventEmitter<any>();
  @Output() dataSourceChange = new EventEmitter<DataSourceChangeEvent>();

  /**
   * Component for the layer datasource selection tab
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param gridLayoutService Shared layout service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private gridLayoutService: SafeGridLayoutService,
    private aggregationService: SafeAggregationService
  ) {
    super();
  }

  ngOnInit(): void {
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
    const resourceID = this.form.get('datasource.resource')?.value;
    if (resourceID) {
      const layoutID = this.form.value.datasource?.layout;
      const aggregationID = this.form.value.datasource?.aggregation;
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
          }
          if (aggregationID) {
            this.aggregation =
              data.resource.aggregations?.edges[0]?.node || null;
          }
        });
    }

    // If form has a refData, fetch it
    const refDataID = this.form.get('datasource.refData')?.value;
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

    this.setLayerDataSourceListeners();
  }

  /**
   * Initialize layer datasource form listeners
   */
  private setLayerDataSourceListeners() {
    // Listen to origin changes
    this.form
      .get('datasource.origin')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.get('datasource.resource')?.setValue(null);
        this.form.get('datasource.refData')?.setValue(null);
        this.fieldsChange.emit([]);
      });

    // Listen to resource changes
    this.form
      .get('datasource.resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((resourceID) => {
        this.resource =
          this.resourceSelect?.elements
            .getValue()
            .find((x) => x.id === resourceID) || null;
        this.form.get('datasource.layout')?.setValue(null);
        this.form.get('datasource.aggregation')?.setValue(null);
        this.layout = null;
        this.aggregation = null;
        this.fieldsChange.emit([]);
      });

    // Listen to refData changes
    this.form
      .get('datasource.refData')
      ?.valueChanges.pipe(pairwise(), takeUntil(this.destroy$))
      .subscribe(([prevRefDataId, currRefDataId]) => {
        if (currRefDataId) {
          this.dataSourceChange.emit({
            origin: 'reference',
            type: 'refData',
            id: currRefDataId,
            ...this.fieldData,
          });
          // If there was a refData and now we delete it
          // We trigger the dataSourceChange event
        } else if (prevRefDataId && !currRefDataId) {
          this.dataSourceChange.emit();
        }

        this.refData =
          this.refDataSelect?.elements
            .getValue()
            .find((x) => x.id === currRefDataId) || null;
        this.emitFields('refData');
      });

    // Listen to layout changes
    this.form
      .get('datasource.layout')
      ?.valueChanges.pipe(pairwise(), takeUntil(this.destroy$))
      .subscribe(([prevLayoutId, currLayoutId]) => {
        if (currLayoutId) {
          this.dataSourceChange.emit({
            origin: 'resource',
            type: 'layout',
            id: currLayoutId,
            ...this.fieldData,
          });
          // If there was a layout and now we delete it
          // We trigger the dataSourceChange event
        } else if (prevLayoutId && !currLayoutId) {
          this.dataSourceChange.emit();
        }
      });

    // Listen to aggregation changes
    this.form
      .get('datasource.aggregation')
      ?.valueChanges.pipe(pairwise(), takeUntil(this.destroy$))
      .subscribe(([prevAggregationId, currAggregationId]) => {
        if (currAggregationId) {
          this.dataSourceChange.emit({
            origin: 'resource',
            type: 'aggregation',
            id: currAggregationId,
            ...this.fieldData,
          });
          // If there was a aggregation and now we delete it
          // We trigger the dataSourceChange event
        } else if (prevAggregationId && !currAggregationId) {
          this.dataSourceChange.emit();
        }
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
        this.form.get('datasource.layout')?.setValue(value.id);
        this.layout = value;
        this.emitFields('layout');
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
        this.form.get('datasource.aggregation')?.setValue(value.id);
        this.aggregation = value;
        this.emitFields('aggregation');
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
            this.layout = res.data?.editLayout || null;

            this.dataSourceChange.emit({
              origin: 'resource',
              type: 'layout',
              id: this.layout?.id as string,
              ...this.fieldData,
            });

            this.emitFields('layout');
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
            this.aggregation = res.data?.editAggregation || null;
            this.dataSourceChange.emit({
              origin: 'resource',
              type: 'aggregation',
              id: this.aggregation?.id as string,
              ...this.fieldData,
            });
            this.emitFields('aggregation');
          });
      }
    });
  }

  /**
   * Emits fields from selected datasource
   *
   * @param type Type of datasource
   */
  public emitFields(type?: 'layout' | 'aggregation' | 'refData'): void {
    if (!type) this.fieldsChange.emit([]);

    switch (type) {
      case 'layout':
        this.fieldsChange.emit(get(this.layout, 'query.fields', []));
        break;
      case 'aggregation':
        // TODO: get fields from aggregation
        this.fieldsChange.emit([]);
        break;
      case 'refData':
        this.fieldsChange.emit(get(this.refData, 'fields', []));
        break;
    }
  }

  /**
   * Disable/enable fields from datasource by the given checkbox selection
   *
   * @param event Checkbox event
   */
  updateFieldsFormProperties(event: MatCheckboxChange) {
    if (event.source.value === 'geoField') {
      // If geoField has value, disable latitude and longitude fields
      if (event.checked) {
        this.form
          .get('datasource.latitudeField')
          ?.disable({ emitEvent: false });
        this.form
          .get('datasource.longitudeField')
          ?.disable({ emitEvent: false });
      } else {
        this.form.get('datasource.latitudeField')?.enable({ emitEvent: false });
        this.form
          .get('datasource.longitudeField')
          ?.enable({ emitEvent: false });
      }
    } else {
      if (event.checked) {
        // If any of these fields has value, disable geo field
        this.form.get('datasource.geoField')?.disable({ emitEvent: false });
      } else {
        this.form.get('datasource.geoField')?.enable({ emitEvent: false });
      }
    }
  }
}
