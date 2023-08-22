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
import { Apollo, QueryRef } from 'apollo-angular';
import {
  takeUntil,
  BehaviorSubject,
  Observable,
  Subject,
  distinctUntilChanged,
} from 'rxjs';
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
  GET_REFERENCE_DATAS,
  GET_REFERENCE_DATA,
} from '../../graphql/queries';
import { AddLayoutModalComponent } from '../../../../grid-layout/add-layout-modal/add-layout-modal.component';
import { get, isEqual } from 'lodash';
import { AddAggregationModalComponent } from '../../../../aggregation/add-aggregation-modal/add-aggregation-modal.component';
import { SafeEditLayoutModalComponent } from '../../../../grid-layout/edit-layout-modal/edit-layout-modal.component';
import { SafeGridLayoutService } from '../../../../../services/grid-layout/grid-layout.service';
import { SafeAggregationService } from '../../../../../services/aggregation/aggregation.service';
import { SafeEditAggregationModalComponent } from '../../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { SafeMapLayersService } from '../../../../../services/map/map-layers.service';
import { Fields } from '../../../../../models/layer.model';
import { GraphQLSelectComponent } from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';

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
  implements OnInit, AfterViewInit
{
  @Input() formGroup!: FormGroup;
  @Input() resourceQuery!: BehaviorSubject<GetResourceQueryResponse | null>;
  public origin!: FormControl<string | null>;

  // Resource
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public resource: Resource | null = null;
  @ViewChild(GraphQLSelectComponent)
  resourceSelect?: GraphQLSelectComponent;

  // Reference data
  public refDatasQuery!: QueryRef<GetReferenceDatasQueryResponse>;
  public refData: ReferenceData | null = null;
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

  /**
   * Component for the layer datasource selection tab
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param gridLayoutService Shared layout service
   * @param aggregationService Shared aggregation service
   * @param mapLayersService Shared map layer Service.
   * @param cdr Change detector
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private gridLayoutService: SafeGridLayoutService,
    private aggregationService: SafeAggregationService,
    private mapLayersService: SafeMapLayersService,
    private cdr: ChangeDetectorRef
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

    // If the form has a resource, get info from
    const resourceID = this.formGroup.value.resource;
    if (resourceID) {
      this.resourceQuery.subscribe((data: GetResourceQueryResponse | null) => {
        const layoutID = this.formGroup.value.layout;
        const aggregationID = this.formGroup.value.aggregation;
        if (data) {
          this.resource = data.resource;
          if (layoutID) {
            this.layout =
              data.resource.layouts?.edges.find(
                (layout) => layout.node.id === layoutID
              )?.node ?? null;
          } else {
            if (aggregationID) {
              this.aggregation =
                data.resource.aggregations?.edges.find(
                  (layout) => layout.node.id === aggregationID
                )?.node ?? null;
            }
          }
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
      ?.valueChanges.pipe(
        distinctUntilChanged((prev, next) => isEqual(prev, next)),
        takeUntil(this.destroy$)
      )
      .subscribe((resourceID) => {
        this.resource =
          this.resourceSelect?.elements
            .getValue()
            .find((x) => x.id === resourceID) || null;

        this.formGroup.get('layout')?.setValue(null, { emitEvent: false });
        this.formGroup.get('aggregation')?.setValue(null, { emitEvent: false });
        this.formGroup.get('geoField')?.setValue(null, { emitEvent: false });
        this.formGroup
          .get('latitudeField')
          ?.setValue(null, { emitEvent: false });
        this.formGroup
          .get('longitudeField')
          ?.setValue(null, { emitEvent: false });
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
          this.fields.next(
            this.getFieldsFromRefData(this.refData?.fields || [])
          );
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
        if (this.refData) {
          this.fields.next(
            this.getFieldsFromRefData(this.refData.fields || [])
          );
        }
      });
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
        hasAggregations: get(this.resource, 'aggregations.totalCount', 0) > 0,
        resource: this.resource,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.formGroup.get('aggregation')?.setValue((value as any).id);
        this.aggregation = value;
        this.fields.emit(
          this.mapLayersService.getAggregationFields(
            this.resource,
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
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
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
    const dialogRef = this.dialog.open(SafeEditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
        aggregation: this.aggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.aggregation) {
        this.aggregationService
          .editAggregation(this.aggregation, value, this.resource?.id)
          .subscribe((res) => {
            this.aggregation = get(res, 'data.editAggregation', null);
            this.fields.emit(
              this.mapLayersService.getAggregationFields(
                this.resource,
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
