import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Resource } from '../../../../models/resource.model';
import { ReferenceData } from '../../../../models/reference-data.model';
import { CHART_TYPES } from '../constants';
import { Aggregation } from '../../../../models/aggregation.model';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { AggregationService } from '../../../../services/aggregation/aggregation.service';
import { get } from 'lodash';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';

/**
 * Main tab of chart settings modal.
 */
@Component({
  selector: 'shared-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent
  extends UnsubscribeComponent
  implements OnChanges
{
  /** Reactive form group */
  @Input() formGroup!: UntypedFormGroup;
  /** Selected chart type */
  @Input() type: any;
  /** Available chart types */
  public types = CHART_TYPES;
  /** Current resource */
  @Input() resource?: Resource;
  /** Current reference data */
  @Input() referenceData?: ReferenceData;
  /** Current aggregation */
  @Input() aggregation?: Aggregation;
  /** Available fields */
  public availableSeriesFields: any[] = [];
  /** Emits when the aggregation changes */
  @Output() aggregationChange = new EventEmitter<Aggregation | null>();

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
   * @param dialog Dialog service
   * @param aggregationBuilder Shared aggregation builder service
   * @param queryBuilder Shared query builder service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private dialog: Dialog,
    private aggregationBuilder: AggregationBuilderService,
    private queryBuilder: QueryBuilderService,
    private aggregationService: AggregationService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.aggregation || changes.referenceData) {
      this.setAvailableSeriesFields();
    }
  }

  /**
   * Set available series fields, from resource fields and aggregation definition.
   */
  private setAvailableSeriesFields(): void {
    if (this.aggregation) {
      const fields = this.queryBuilder
        .getFields(this.resource?.queryName as string)
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
              fields: this.queryBuilder.deconfineFields(
                field.type,
                new Set().add(this.resource?.name).add(field.type.ofType?.name)
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
    } else if (this.referenceData) {
      this.availableSeriesFields = (this.referenceData.fields ?? [])
        .filter((f) => f.type !== 'object')
        .map((f) => ({
          name: f.name,
          type: {
            kind: 'SCALAR',
          },
        }));
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
        hasAggregations: get(this.resource, 'aggregations.totalCount', 0) > 0, // check if at least one existing aggregation
        resource: this.resource,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.formGroup.get('chart.aggregationId')?.setValue(value.id);
        this.aggregationChange.emit(value);
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
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && this.aggregation) {
        this.aggregationService
          .editAggregation(this.aggregation, value, this.resource?.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(({ data }) => {
            if (data?.editAggregation?.id) {
              this.aggregationChange.emit(data.editAggregation);
            }
          });
      }
    });
  }
}
