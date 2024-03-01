import { Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntil, Observable } from 'rxjs';
import { Resource } from '../../../../../models/resource.model';
import { ReferenceData } from '../../../../../models/reference-data.model';
import { Aggregation } from '../../../../../models/aggregation.model';
import { Layout } from '../../../../../models/layout.model';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { AddLayoutModalComponent } from '../../../../grid-layout/add-layout-modal/add-layout-modal.component';
import { get } from 'lodash';
import { AddAggregationModalComponent } from '../../../../aggregation/add-aggregation-modal/add-aggregation-modal.component';
import { EditLayoutModalComponent } from '../../../../grid-layout/edit-layout-modal/edit-layout-modal.component';
import { GridLayoutService } from '../../../../../services/grid-layout/grid-layout.service';
import { AggregationService } from '../../../../../services/aggregation/aggregation.service';
import { EditAggregationModalComponent } from '../../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component';
import { FormGroup } from '@angular/forms';
import { Fields } from '../../../../../models/layer.model';
import { Dialog } from '@angular/cdk/dialog';
import { DomPortal } from '@angular/cdk/portal';

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
export class LayerDatasourceComponent extends UnsubscribeComponent {
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Selected resource */
  @Input() resource: Resource | null = null;
  /** Selected reference data */
  @Input() referenceData: ReferenceData | null = null;
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
  /** Admin fields */
  public adminFields = ADMIN_FIELDS;

  /**
   * Component for the layer datasource selection tab
   *
   * @param dialog Dialog service
   * @param gridLayoutService Shared layout service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private dialog: Dialog,
    private gridLayoutService: GridLayoutService,
    private aggregationService: AggregationService
  ) {
    super();
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
        if (typeof value === 'string') {
          this.formGroup.get('layout')?.setValue(value);
        } else {
          this.formGroup.get('layout')?.setValue((value as any).id);
        }
      }
    });
  }

  /** Opens modal for aggregation selection/creation */
  selectAggregation(): void {
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations:
          get(this.resource, 'aggregations.totalCount', 0) > 0 ||
          get(this.referenceData, 'aggregations.totalCount', 0) > 0,
        resource: this.resource,
        referenceData: this.referenceData,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.formGroup.get('aggregation')?.setValue(value);
        } else {
          this.formGroup.get('aggregation')?.setValue((value as any)?.id);
        }
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
        referenceData: this.referenceData,
        aggregation: this.aggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.aggregation) {
        this.aggregationService
          .editAggregation(this.aggregation, value, {
            resource: this.resource?.id,
            referenceData: this.referenceData?.id,
          })
          .subscribe(() => {
            this.formGroup
              .get('aggregation')
              ?.setValue(this.formGroup.value.aggregation);
          });
      }
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
