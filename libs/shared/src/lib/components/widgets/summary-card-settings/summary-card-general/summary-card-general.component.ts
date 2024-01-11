import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SummaryCardItemModule } from '../../summary-card/summary-card-item/summary-card-item.module';
import { SummaryCardFormT } from '../summary-card-settings.component';
import { Aggregation } from '../../../../models/aggregation.model';
import { Resource } from '../../../../models/resource.model';
import { Layout } from '../../../../models/layout.model';
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
import { Form } from '../../../../models/form.model';

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
  ],
  templateUrl: './summary-card-general.component.html',
  styleUrls: ['./summary-card-general.component.scss'],
})
export class SummaryCardGeneralComponent
  extends UnsubscribeComponent
  implements OnDestroy
{
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
  /** Available resource templates */
  @Input() templates?: Form[];
  /** Emits when the select template is opened for the first time */
  @Output() loadTemplates = new EventEmitter<void>();
  /** Saves if the layouts has been fetched */
  @Input() loadedLayouts = false;
  /** Saves if the aggregations has been fetched */
  @Input() loadedAggregations = false;
  /** Emits when complete layout list should be fetched */
  @Output() loadLayouts = new EventEmitter<void>();
  /** Emits when complete aggregations list should be fetched */
  @Output() loadAggregations = new EventEmitter<void>();
  /** Saves if the templates has been fetched */
  public loadedTemplates = false;
  /** Timeout listener for add layout modal opening */
  private layoutTimeoutListener!: NodeJS.Timeout;
  /** Timeout listener for add aggregation modal opening */
  private aggregationTimeoutListener!: NodeJS.Timeout;

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
    if (!this.loadedLayouts) {
      this.loadLayouts.emit();
    }
    const { AddLayoutModalComponent } = await import(
      '../../../grid-layout/add-layout-modal/add-layout-modal.component'
    );
    const awaitTime = this.loadedLayouts ? 0 : 500;
    if (this.layoutTimeoutListener) {
      clearTimeout(this.layoutTimeoutListener);
    }
    this.layoutTimeoutListener = setTimeout(() => {
      const dialogRef = this.dialog.open(AddLayoutModalComponent, {
        data: {
          resource: this.resource,
          useQueryRef: false,
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
    }, awaitTime);
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
    if (!this.loadedAggregations) {
      this.loadAggregations.emit();
    }
    const { AddAggregationModalComponent } = await import(
      '../../../aggregation/add-aggregation-modal/add-aggregation-modal.component'
    );
    const awaitTime = this.loadedLayouts ? 0 : 500;
    if (this.aggregationTimeoutListener) {
      clearTimeout(this.aggregationTimeoutListener);
    }
    this.aggregationTimeoutListener = setTimeout(() => {
      const dialogRef = this.dialog.open(AddAggregationModalComponent, {
        data: {
          resource: this.resource,
          useQueryRef: false,
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
    }, awaitTime);
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
  public clearFormField(formField: string, event: Event) {
    if (this.formGroup.get(formField)?.value) {
      this.formGroup.get(formField)?.setValue(null);
    }
    event.stopPropagation();
  }

  /**
   * On open select menu the first time, emits event to load resource templates query.
   */
  public onOpenSelectTemplates(): void {
    if (!this.loadedTemplates) {
      this.loadTemplates.emit();
      this.loadedTemplates = true;
    }
  }

  override ngOnDestroy(): void {
    if (this.layoutTimeoutListener) {
      clearTimeout(this.layoutTimeoutListener);
    }
    if (this.aggregationTimeoutListener) {
      clearTimeout(this.aggregationTimeoutListener);
    }
    super.ngOnDestroy();
  }
}
