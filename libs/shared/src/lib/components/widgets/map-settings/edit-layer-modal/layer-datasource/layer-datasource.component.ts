import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { takeUntil, Observable } from 'rxjs';
import { Resource } from '../../../../../models/resource.model';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
  ReferenceDatasQueryResponse,
} from '../../../../../models/reference-data.model';
import { Aggregation } from '../../../../../models/aggregation.model';
import { Layout } from '../../../../../models/layout.model';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { GET_REFERENCE_DATAS, GET_REFERENCE_DATA } from '../../graphql/queries';
import { AddLayoutModalComponent } from '../../../../grid-layout/add-layout-modal/add-layout-modal.component';
import { get } from 'lodash';
import { AddAggregationModalComponent } from '../../../../aggregation/add-aggregation-modal/add-aggregation-modal.component';
import { EditLayoutModalComponent } from '../../../../grid-layout/edit-layout-modal/edit-layout-modal.component';
import { GridLayoutService } from '../../../../../services/grid-layout/grid-layout.service';
import { AggregationService } from '../../../../../services/aggregation/aggregation.service';
import { EditAggregationModalComponent } from '../../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { MapLayersService } from '../../../../../services/map/map-layers.service';
import { Fields } from '../../../../../models/layer.model';
import { GraphQLSelectComponent } from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { DomPortal } from '@angular/cdk/portal';

/** Default items per resources query, for pagination */
const ITEMS_PER_PAGE = 10;

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
  implements OnInit
{
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Selected resource */
  @Input() resource: Resource | null = null;
  /** Selected aggregation */
  @Input() aggregation: Aggregation | null = null;
  /** Selected layout */
  @Input() layout: Layout | null = null;
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** Map dom portal */
  @Input() mapPortal?: DomPortal;
  /** Emit new fields */
  @Output() fields: EventEmitter<Fields[]> = new EventEmitter<Fields[]>();
  /** Reference to reference data graphql select */
  @ViewChild(GraphQLSelectComponent)
  refDataSelect?: GraphQLSelectComponent;
  /** Type of origin ( resource or reference data ) */
  public origin!: FormControl<string | null>;
  /** Query to get reference data */
  public refDatasQuery!: QueryRef<ReferenceDatasQueryResponse>;
  /** Selected reference data */
  public refData: ReferenceData | null = null;
  /** Admin fields */
  public adminFields = ADMIN_FIELDS;

  /**
   * Component for the layer datasource selection tab
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param gridLayoutService Shared layout service
   * @param aggregationService Shared aggregation service
   * @param mapLayersService Shared map layer Service.
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private gridLayoutService: GridLayoutService,
    private aggregationService: AggregationService,
    private mapLayersService: MapLayersService
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

    this.refDatasQuery = this.apollo.watchQuery<ReferenceDatasQueryResponse>({
      query: GET_REFERENCE_DATAS,
      variables: {
        first: ITEMS_PER_PAGE,
      },
    });

    // Listen to origin changes
    this.origin.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formGroup.patchValue({ resource: null, refData: null });
    });

    // If form has a refData, fetch it
    const refDataID = this.formGroup.get('refData')?.value;
    if (refDataID) {
      this.apollo
        .query<ReferenceDataQueryResponse>({
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

  /** Opens modal for layout selection/creation */
  public selectLayout() {
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.resource,
        hasLayouts: get(this.resource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      console.log(value);
      if (typeof value === 'string') {
        this.formGroup.get('layout')?.setValue(value);
      } else {
        this.formGroup.get('layout')?.setValue((value as any).id);
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
      if (typeof value === 'string') {
        this.formGroup.get('aggregation')?.setValue(value);
      } else {
        this.formGroup.get('aggregation')?.setValue((value as any).id);
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
          .subscribe(() => {
            this.formGroup.get('layout')?.setValue(this.formGroup.value.layout);
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
        aggregation: this.aggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.aggregation) {
        this.aggregationService
          .editAggregation(this.aggregation, value, this.resource?.id)
          .subscribe(() => {
            this.formGroup
              .get('aggregation')
              ?.setValue(this.formGroup.value.aggregation);
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
          name: field.name,
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
