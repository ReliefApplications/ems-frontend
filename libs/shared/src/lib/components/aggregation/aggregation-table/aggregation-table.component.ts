import { Component, Input, OnInit } from '@angular/core';
import { Layout } from '../../../models/layout.model';
import { Form } from '../../../models/form.model';
import { Resource } from '../../../models/resource.model';
import { ReferenceData } from '../../../models/reference-data.model';
import { UntypedFormControl } from '@angular/forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Aggregation } from '../../../models/aggregation.model';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { get } from 'lodash';
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
  implements OnInit
{
  /** Can select new aggregations or not */
  @Input() canAdd = true;
  @Input() resource: Resource | null = null;
  @Input() referenceData: ReferenceData | null = null;
  @Input() form: Form | null = null;
  @Input() selectedAggregations: UntypedFormControl | null = null;

  aggregations: Layout[] = [];
  allAggregations: Layout[] = [];
  columns: string[] = ['name', 'createdAt', '_actions'];

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

  /**
   * Sets the list of all aggregations from resource / form / referenceData.
   */
  private setAllAggregations(): void {
    if (this.form) {
      this.allAggregations = this.form.aggregations
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...this.form.aggregations.edges?.map((e) => e.node)]
        : [];
    } else {
      if (this.resource) {
        this.allAggregations = this.resource.aggregations
          ? // eslint-disable-next-line no-unsafe-optional-chaining
            [...this.resource.aggregations.edges?.map((e) => e.node)]
          : [];
      } else if (this.referenceData) {
        this.allAggregations = this.referenceData.aggregations
          ? [...this.referenceData.aggregations.edges.map((e) => e.node)]
          : [];
      } else {
        this.allAggregations = [];
      }
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
    const { AddAggregationModalComponent } = await import(
      '../add-aggregation-modal/add-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations:
          get(
            this.form
              ? this.form
              : this.resource
              ? this.resource
              : this.referenceData,
            'aggregations.totalCount',
            0
          ) > 0, // check if at least one existing aggregation
        form: this.form,
        resource: this.resource,
        referenceData: this.referenceData,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        if (!this.allAggregations.find((x) => x.id === value.id)) {
          this.allAggregations.push(value);
        }
        this.selectedAggregations?.setValue(
          this.selectedAggregations?.value.concat(value.id)
        );
      }
    });
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
        referenceData: this.referenceData,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        const id = this.resource?.id ?? this.referenceData?.id;
        const type = this.resource?.id ? 'resource' : 'referenceData';
        this.aggregationService
          .editAggregation(aggregation, value, id, type)
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
