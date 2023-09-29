import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  takeUntil,
  BehaviorSubject,
  Observable,
  Subject,
  distinctUntilChanged,
} from 'rxjs';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../../../models/resource.model';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
} from '../../../../../models/reference-data.model';
import { Aggregation } from '../../../../../models/aggregation.model';
import { Layout } from '../../../../../models/layout.model';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import {
  GET_RESOURCES,
  GET_REFERENCE_DATAS,
  GET_REFERENCE_DATA,
  GET_RESOURCE,
} from '../../graphql/queries';
import { AddLayoutModalComponent } from '../../../../grid-layout/add-layout-modal/add-layout-modal.component';
import { get, isEqual } from 'lodash';
import { AddAggregationModalComponent } from '../../../../aggregation/add-aggregation-modal/add-aggregation-modal.component';
import { EditLayoutModalComponent } from '../../../../grid-layout/edit-layout-modal/edit-layout-modal.component';
import { GridLayoutService } from '../../../../../services/grid-layout/grid-layout.service';
import {
  AggregationService,
  AggregationSource,
} from '../../../../../services/aggregation/aggregation.service';
import { EditAggregationModalComponent } from '../../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component';
import { FormGroup } from '@angular/forms';
import { MapLayersService } from '../../../../../services/map/map-layers.service';
import { Fields } from '../../../../../models/layer.model';
import { GraphQLSelectComponent } from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';

/** Available admin fields ( only admin 0 now ) */
const ADMIN_FIELDS = [
  {
    name: 'admin0',
    fields: [
      {
        name: 'Alpha-3 code',
        value: 'admin0.iso3code',
      },
      {
        name: 'Alpha-2 code',
        value: 'admin0.iso2code',
      },
      {
        name: 'ID',
        value: 'admin0.id',
      },
    ],
  },
];

/** Component for the layer datasource selection tab */
@Component({
  selector: 'shared-layer-datasource',
  templateUrl: './layer-datasource.component.html',
  styleUrls: ['./layer-datasource.component.scss'],
})
export class LayerDatasourceComponent
  extends UnsubscribeComponent
  implements OnInit, AfterViewInit
{
  @Input() formGroup!: FormGroup;

  // Resource
  public resource: Resource | null = null;
  @ViewChild(GraphQLSelectComponent)
  resourceSelect?: GraphQLSelectComponent;

  // Reference data
  public referenceData: ReferenceData | null = null;
  @ViewChild(GraphQLSelectComponent)
  refDataSelect?: GraphQLSelectComponent;

  // Aggregation and layout
  public aggregation: Aggregation | null = null;
  public layout: Layout | null = null;

  @Input() fields$!: Observable<Fields[]>;
  @Output() fields: EventEmitter<Fields[]> = new EventEmitter<Fields[]>();

  // Display of map
  @Input() currentMapContainerRef!: BehaviorSubject<ViewContainerRef | null>;
  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainerRef!: ViewContainerRef;
  @Input() destroyTab$!: Subject<boolean>;

  public adminFields = ADMIN_FIELDS;

  // Queries to fetch resources and references datas
  getResources = GET_RESOURCES;
  getReferenceDatas = GET_REFERENCE_DATAS;

  /**
   * Component for the layer datasource selection tab
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param gridLayoutService Shared layout service
   * @param aggregationService Shared aggregation service
   * @param mapLayersService Shared map layer Service.
   * @param cdr Change detector
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private gridLayoutService: GridLayoutService,
    private aggregationService: AggregationService,
    private mapLayersService: MapLayersService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    // If the form has a resource, get info from
    const resourceID = this.formGroup.value.resource;
    if (resourceID) {
      this.getResource(resourceID);
    }

    // If form has a referenceData, fetch it
    const referenceDataID = this.formGroup.get('referenceData')?.value;
    if (referenceDataID) {
      this.getReferenceData(referenceDataID);
    }

    // Listen to resource changes
    this.formGroup
      .get('resource')
      ?.valueChanges.pipe(
        distinctUntilChanged((prev, next) => isEqual(prev, next)),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        if (value) {
          this.getResource(value);
        }
        this.handleSourceFormChange();
      });

    // Listen to referenceData changes
    this.formGroup
      .get('referenceData')
      ?.valueChanges.pipe(
        distinctUntilChanged((prev, next) => isEqual(prev, next)),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        if (value) {
          this.getReferenceData(value);
        }
        this.handleSourceFormChange();
      });
  }

  /**
   * Fetch the resource with the given id
   *
   * @param resourceID resource id to fetch
   */
  private getResource(resourceID: string) {
    const layoutID = this.formGroup.get('layout')?.value;
    const aggregationID = this.formGroup.get('aggregation')?.value;
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id: resourceID,
          layout: layoutID ? [layoutID] : [],
          aggregation: aggregationID ? [aggregationID] : [],
        },
      })
      .subscribe(({ data }) => {
        this.resource = data.resource;
        this.updateFields('resource');
      });
  }

  /**
   * Fetch the reference data with the given id
   *
   * @param referenceDataID reference data id to fetch
   */
  private getReferenceData(referenceDataID: string) {
    const aggregationID = this.formGroup.get('aggregation')?.value;
    this.apollo
      .query<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id: referenceDataID,
          aggregation: aggregationID ? [aggregationID] : [],
        },
      })
      .subscribe(({ data }) => {
        this.referenceData = data.referenceData;
        this.updateFields('referenceData');
      });
  }

  /**
   * Update current form whenever source type changes
   */
  private handleSourceFormChange() {
    this.formGroup.patchValue({
      layout: null,
      aggregation: null,
      geoField: null,
      adminField: null,
      latitudeField: null,
      longitudeField: null,
    });
    this.layout = null;
    this.aggregation = null;
  }

  ngAfterViewInit(): void {
    this.currentMapContainerRef
      .pipe(takeUntil(this.destroyTab$))
      .subscribe((viewContainerRef) => {
        if (viewContainerRef) {
          if (viewContainerRef !== this.mapContainerRef) {
            const view = viewContainerRef.detach();
            if (view) {
              this.mapContainerRef.insert(view);
              this.cdr.detectChanges();
              this.currentMapContainerRef.next(this.mapContainerRef);
            }
          }
        }
      });
  }

  /**
   * Handle source change from the aggregation origin selection
   *
   * @param event event containing source type and value
   * @param {AggregationSource} event.type source type
   * @param event.value selected source value from where load aggregations
   */
  handleSourceChange(event: { type: AggregationSource; value: any }) {
    const { type, value } = event;
    if (type === 'resource') {
      this.resource = value;
      this.updateFields('resource');
    } else if (type === 'referenceData') {
      this.referenceData = value;
      this.updateFields('referenceData');
    }
  }

  /**
   * Update aggregation and layout fields for the given source type
   *
   * @param type source type from where to update fields
   */
  private updateFields(type: AggregationSource) {
    switch (type) {
      case 'resource':
        if (this.resource) {
          const layoutID = this.formGroup.value.layout;
          const aggregationID = this.formGroup.value.aggregation;
          if (layoutID) {
            this.layout =
              this.resource.layouts?.edges.find(
                (layout) => layout.node.id === layoutID
              )?.node ?? null;
            this.fields.emit(this.mapLayersService.getQueryFields(this.layout));
          } else {
            if (aggregationID) {
              this.aggregation =
                this.resource.aggregations?.edges.find(
                  (layout) => layout.node.id === aggregationID
                )?.node ?? null;
              this.fields.emit(
                this.mapLayersService.getAggregationFields(
                  this.resource,
                  'resource',
                  this.aggregation
                )
              );
            }
          }
        }
        break;
      case 'referenceData':
        if (this.referenceData) {
          const aggregationID = this.formGroup.value.aggregation;
          if (aggregationID) {
            this.aggregation =
              this.referenceData.aggregations?.edges.find(
                (aggregation) => aggregation.node.id === aggregationID
              )?.node ?? null;
          } //only load fields if we do not have an aggregation
          else
            this.fields.emit(
              this.getFieldsFromRefData(this.referenceData?.fields || [])
            );
        }
        break;
      default:
        break;
    }
  }

  /** Opens modal for layout selection/creation */
  public selectLayout() {
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.resource,
        hasLayouts: get(this.resource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.formGroup.get('layout')?.setValue((value as any).id);
        this.layout = value;
        this.fields.emit(this.mapLayersService.getQueryFields(this.layout));
      }
    });
  }

  /** Opens modal for aggregation selection/creation */
  selectAggregation(): void {
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations:
          get(
            this.resource ?? this.referenceData,
            'aggregations.totalCount',
            0
          ) > 0,
        resource: this.resource,
        referenceData: this.referenceData,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.formGroup.get('aggregation')?.setValue((value as any).id);
        this.aggregation = value;
        const type = this.resource ? 'resource' : 'referenceData';
        const source = this.resource ?? this.referenceData;
        this.fields.emit(
          this.mapLayersService.getAggregationFields(
            source,
            type,
            this.aggregation
          )
        );
      }
    });
  }

  /**
   * Edit chosen layout, in a modal. If saved, update it.
   */
  public editLayout(): void {
    const dialogRef = this.dialog.open(EditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout: this.layout,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.layout) {
        this.gridLayoutService
          .editLayout(this.layout, value, this.resource?.id)
          .subscribe((res: any) => {
            this.layout = get(res, 'data.editLayout', null);
            this.fields.emit(this.mapLayersService.getQueryFields(this.layout));
          });
      }
    });
  }

  /**
   * Edit chosen aggregation, in a modal. If saved, update it.
   */
  public editAggregation(): void {
    const dialogRef = this.dialog.open(EditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
        referenceData: this.referenceData,
        aggregation: this.aggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.aggregation) {
        const type = this.resource ? 'resource' : 'referenceData';
        const source = this.resource ?? this.referenceData;
        this.aggregationService
          .editAggregation(this.aggregation, value, source?.id, type)
          .subscribe((res) => {
            this.aggregation = get(res, 'data.editAggregation', null);
            this.fields.emit(
              this.mapLayersService.getAggregationFields(
                source,
                type,
                this.aggregation
              )
            );
          });
      }
    });
  }

  /**
   * Extract layer fields from reference data
   *
   * @param fields available reference data fields
   * @returns layer fields
   */
  private getFieldsFromRefData(fields: any[]): Fields[] {
    return fields
      .filter((field) => field && typeof field !== 'string')
      .map((field) => {
        return {
          label: field.name,
          name: field.graphQLFieldName,
          type: field.type,
        } as Fields;
      });
  }
}
