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
import { ResourceSelectComponent } from '../../../controls/resource-select/resource-select.component';

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
  ],
  templateUrl: './summary-card-general.component.html',
  styleUrls: ['./summary-card-general.component.scss'],
})
export class SummaryCardGeneralComponent extends UnsubscribeComponent {
  /** Widget form group */
  @Input() formGroup!: SummaryCardFormT;
  /** Selected resource */
  @Input() selectedResource: Resource | null = null;
  /** Selected layout */
  @Input() selectedLayout: Layout | null = null;
  /** Selected aggregation */
  @Input() selectedAggregation: Aggregation | null = null;

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
    if (!this.selectedResource) {
      return;
    }
    const { AddLayoutModalComponent } = await import(
      '../../../grid-layout/add-layout-modal/add-layout-modal.component'
    );
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.selectedResource,
        hasLayouts: get(this.selectedResource, 'layouts.totalCount', 0) > 0,
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
        layout: this.selectedLayout,
        queryName: this.selectedResource?.queryName,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.selectedLayout) {
        this.layoutService
          .editLayout(this.selectedLayout, value, this.selectedResource?.id)
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
    const { AddAggregationModalComponent } = await import(
      '../../../aggregation/add-aggregation-modal/add-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations:
          get(this.selectedResource, 'aggregations.totalCount', 0) > 0, // check if at least one existing aggregation
        resource: this.selectedResource,
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
        resource: this.selectedResource,
        aggregation: this.selectedAggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.selectedAggregation) {
        this.aggregationService
          .editAggregation(
            this.selectedAggregation,
            value,
            this.selectedResource?.id
          )
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
}
