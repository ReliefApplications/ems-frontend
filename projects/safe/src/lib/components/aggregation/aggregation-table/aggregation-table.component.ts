import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Layout } from '../../../models/layout.model';
import { Form } from '../../../models/form.model';
import { Resource } from '../../../models/resource.model';
import { FormControl } from '@angular/forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { AddAggregationModalComponent } from '../add-aggregation-modal/add-aggregation-modal.component';
import { Aggregation } from '../../../models/aggregation.model';
import { SafeEditAggregationModalComponent } from '../edit-aggregation-modal/edit-aggregation-modal.component';
import { SafeAggregationService } from '../../../services/aggregation/aggregation.service';

/**
 * Aggregation table component.
 */
@Component({
  selector: 'safe-aggregation-table',
  templateUrl: './aggregation-table.component.html',
  styleUrls: ['./aggregation-table.component.scss'],
})
export class AggregationTableComponent implements OnInit, OnChanges {
  @Input() resource: Resource | null = null;
  @Input() form: Form | null = null;
  @Input() selectedAggregations: FormControl | null = null;

  aggregations: Layout[] = [];
  allAggregations: Layout[] = [];
  columns: string[] = ['name', 'createdAt', '_actions'];

  /**
   * Aggregation table component.
   *
   * @param dialog Material Dialog Service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private dialog: MatDialog,
    private aggregationService: SafeAggregationService
  ) {}

  ngOnInit(): void {
    const defaultValue = this.selectedAggregations?.value;
    this.setAllAggregations();
    this.setSelectedAggregations(defaultValue);
    this.selectedAggregations?.valueChanges.subscribe((value) => {
      this.setSelectedAggregations(value);
    });
  }

  ngOnChanges(): void {
    const defaultValue = this.selectedAggregations?.value;
    this.setAllAggregations();
    this.setSelectedAggregations(defaultValue);
  }

  /**
   * Sets the list of all aggregations from resource / form.
   */
  private setAllAggregations(): void {
    if (this.form) {
      this.allAggregations = this.form.aggregations
        ? [...this.form.aggregations.edges?.map((e) => e.node)]
        : [];
    } else {
      if (this.resource) {
        this.allAggregations = this.resource.aggregations
          ? [...this.resource.aggregations.edges?.map((e) => e.node)]
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
  public onAdd(): void {
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        aggregations: this.allAggregations,
        form: this.form,
        resource: this.resource,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
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
  onEditAggregation(aggregation: Aggregation): void {
    const dialogRef = this.dialog.open(SafeEditAggregationModalComponent, {
      disableClose: true,
      data: {
        aggregation,
        resource: this.resource,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.aggregationService
          .editAggregation(aggregation, value, this.resource?.id, this.form?.id)
          .subscribe((res: any) => {
            if (res.data.editAggregation) {
              const layouts = [...this.allAggregations];
              const index = layouts.findIndex((x) => x.id === aggregation.id);
              layouts[index] = res.data.editAggregation;
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
    const aggregation = [...this.selectedAggregations?.value];
    moveItemInArray(aggregation, event.previousIndex, event.currentIndex);
    this.selectedAggregations?.setValue(aggregation);
  }
}
