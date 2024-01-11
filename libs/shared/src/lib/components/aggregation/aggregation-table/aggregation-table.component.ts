import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Layout } from '../../../models/layout.model';
import { Resource } from '../../../models/resource.model';
import { UntypedFormControl } from '@angular/forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Aggregation } from '../../../models/aggregation.model';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';

/**
 * Aggregation table component.
 */
@Component({
  selector: 'shared-aggregation-table',
  templateUrl: './aggregation-table.component.html',
  styleUrls: ['./aggregation-table.component.scss'],
})
export class AggregationTableComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Can select new aggregations or not */
  @Input() canAdd = true;
  /** Aggregation resource */
  @Input() resource: Resource | null = null;
  /** Selected aggregations form control */
  @Input() selectedAggregations: UntypedFormControl | null = null;
  /** Saves if the aggregations has been fetched */
  @Input() loadedAggregations = false;
  /** Emits when complete aggregations list should be fetched */
  @Output() loadAggregations = new EventEmitter<void>();

  /** List of aggregations */
  public aggregations: Layout[] = [];
  /** List of all aggregations */
  public allAggregations: Layout[] = [];
  /** List of displayed columns */
  public columns: string[] = ['name', 'createdAt', '_actions'];
  /** Timeout listener */
  private timeoutListener!: NodeJS.Timeout;

  /**
   * Aggregation table component.
   *
   * @param dialog Dialog Service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private dialog: Dialog,
    private aggregationService: AggregationService
  ) {
    super();
  }

  ngOnInit(): void {
    const defaultValue = this.selectedAggregations?.value;
    this.setAllAggregations();
    this.setSelectedAggregations(defaultValue);
    this.selectedAggregations?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.setSelectedAggregations(value);
      });
  }

  override ngOnDestroy(): void {
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
    super.ngOnDestroy();
  }

  /**
   * Sets the list of all aggregations from resource / form.
   */
  private setAllAggregations(): void {
    if (this.resource) {
      this.allAggregations = this.resource.aggregations
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...this.resource.aggregations.edges?.map((e) => e.node)]
        : [];
    } else {
      this.allAggregations = [];
    }
  }

  /**
   * Selects the aggregations from the form value.
   *
   * @param value form control value.
   */
  private setSelectedAggregations(value: string[]): void {
    this.aggregations =
      this.allAggregations
        .filter((x) => x.id && value.includes(x.id))
        .sort(
          (a, b) => value.indexOf(a.id || '') - value.indexOf(b.id || '')
        ) || [];
  }

  /**
   * Adds a new aggregation to the list.
   */
  public async onAdd(): Promise<void> {
    if (!this.loadedAggregations) {
      this.loadAggregations.emit();
    }
    const { AddAggregationModalComponent } = await import(
      '../add-aggregation-modal/add-aggregation-modal.component'
    );
    const awaitTime = this.loadedAggregations ? 0 : 500;
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
    this.timeoutListener = setTimeout(() => {
      const dialogRef = this.dialog.open(AddAggregationModalComponent, {
        data: {
          resource: this.resource,
          useQueryRef: false,
        },
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            if (!this.allAggregations.find((x) => x.id === value.id)) {
              this.allAggregations.push(value);
              this.resource?.aggregations?.edges?.push({
                node: value,
                cursor: value.id,
              });
            }
            this.selectedAggregations?.setValue(
              this.selectedAggregations?.value.concat(value.id)
            );
          }
        });
    }, awaitTime);
  }

  /**
   * Edits existing aggregation.
   *
   * @param aggregation The aggregation to edit
   */
  async onEditAggregation(aggregation: Aggregation): Promise<void> {
    const { EditAggregationModalComponent } = await import(
      '../edit-aggregation-modal/edit-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(EditAggregationModalComponent, {
      disableClose: true,
      data: {
        aggregation,
        resource: this.resource,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.aggregationService
          .editAggregation(aggregation, value, { resource: this.resource?.id })
          .subscribe(({ data }: any) => {
            if (data.editAggregation) {
              const layouts = [...this.allAggregations];
              const index = layouts.findIndex((x) => x.id === aggregation.id);
              layouts[index] = data.editAggregation;
              this.allAggregations = layouts;
              this.setSelectedAggregations(this.selectedAggregations?.value);
            }
          });
      }
    });
  }

  /**
   * Removes aggregation from list.
   *
   * @param aggregation aggregation to remove.
   */
  onDeleteAggregation(aggregation: Aggregation): void {
    this.selectedAggregations?.setValue(
      this.selectedAggregations?.value.filter(
        (x: string) => x !== aggregation.id
      )
    );
  }

  /**
   * Reorders the aggregation table.
   *
   * @param event drop event
   */
  public drop(event: any): void {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const aggregation = [...this.selectedAggregations?.value];
    moveItemInArray(aggregation, event.previousIndex, event.currentIndex);
    this.selectedAggregations?.setValue(aggregation);
  }
}
