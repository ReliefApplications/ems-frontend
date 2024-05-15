import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SummaryCardItemModule } from '../../summary-card/summary-card-item/summary-card-item.module';
import { SummaryCardFormT } from '../summary-card-settings.component';
import { Aggregation } from '../../../../models/aggregation.model';
import { Resource } from '../../../../models/resource.model';
import { Layout } from '../../../../models/layout.model';
import { get } from 'lodash';
import { GridLayoutService } from '../../../../services/grid-layout/grid-layout.service';
import { AggregationService } from '../../../../services/aggregation/aggregation.service';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import {
  ButtonModule,
  CheckboxModule,
  DividerModule,
  FormWrapperModule,
  GraphQLSelectModule,
  IconModule,
  RadioModule,
  SelectMenuModule,
  SelectOptionModule,
  TooltipModule,
} from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import {
  ReferenceDataSelectComponent,
  ResourceSelectComponent,
} from '../../../controls/public-api';
import { ReferenceData } from '../../../../models/reference-data.model';
import { ReferenceDataVariablesMappingComponent } from '../../common/reference-data-variables-mapping/reference-data-variables-mapping.component';

/** Component for the general summary cards tab */
@Component({
  selector: 'shared-summary-card-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    IconModule,
    SummaryCardItemModule,
    GraphQLSelectModule,
    DividerModule,
    FormWrapperModule,
    SelectMenuModule,
    SelectOptionModule,
    RadioModule,
    CheckboxModule,
    TooltipModule,
    ResourceSelectComponent,
    ReferenceDataSelectComponent,
    DividerModule,
    ReferenceDataVariablesMappingComponent,
  ],
  templateUrl: './summary-card-general.component.html',
  styleUrls: ['./summary-card-general.component.scss'],
})
export class SummaryCardGeneralComponent extends UnsubscribeComponent {
  /** Widget form group */
  @Input() formGroup!: SummaryCardFormT;
  /** Selected reference data */
  @Input() referenceData: ReferenceData | null = null;
  /** Selected resource */
  @Input() resource: Resource | null = null;
  /** Selected layout */
  @Input() layout: Layout | null = null;
  /** Selected aggregation */
  @Input() aggregation: Aggregation | null = null;

  /**
   * Component for the general summary cards tab
   *
   * @param dialog Shared dialog service
   * @param layoutService Shared layout service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private dialog: Dialog,
    private layoutService: GridLayoutService,
    private aggregationService: AggregationService
  ) {
    super();
  }

  /** Opens modal for layout selection/creation */
  public async addLayout() {
    if (!this.resource) {
      return;
    }
    const { AddLayoutModalComponent } = await import(
      '../../../grid-layout/add-layout-modal/add-layout-modal.component'
    );
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.resource,
        hasLayouts: get(this.resource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.formGroup.get('card.layout')?.setValue(value);
        } else {
          this.formGroup.get('card.layout')?.setValue((value as any).id);
        }
      }
    });
  }

  /**
   * Edit chosen layout, in a modal. If saved, update it.
   */
  public async editLayout(): Promise<void> {
    const { EditLayoutModalComponent } = await import(
      '../../../grid-layout/edit-layout-modal/edit-layout-modal.component'
    );
    const dialogRef = this.dialog.open(EditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout: this.layout,
        queryName: this.resource?.queryName,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.layout) {
        this.layoutService
          .editLayout(this.layout, value, this.resource?.id)
          .subscribe(() => {
            if (this.formGroup.get('card.layout')) {
              this.formGroup
                .get('card.layout')
                ?.setValue(this.formGroup.get('card.layout')?.value || null);
            }
          });
      }
    });
  }

  /**
   * Adds a new aggregation for the resource.
   */
  async addAggregation(): Promise<void> {
    if (!this.resource) {
      return;
    }
    const { AddAggregationModalComponent } = await import(
      '../../../aggregation/add-aggregation-modal/add-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations: get(this.resource, 'aggregations.totalCount', 0) > 0, // check if at least one existing aggregation
        resource: this.resource,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.formGroup.get('card.aggregation')?.setValue(value);
        } else {
          this.formGroup.get('card.aggregation')?.setValue((value as any).id);
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
        aggregation: this.aggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.aggregation) {
        this.aggregationService
          .editAggregation(this.aggregation, value, {
            resource: this.resource?.id,
          })
          .subscribe(() => {
            if (this.formGroup.get('card.aggregation')) {
              this.formGroup
                .get('card.aggregation')
                ?.setValue(
                  this.formGroup.get('card.aggregation')?.value || null
                );
            }
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
