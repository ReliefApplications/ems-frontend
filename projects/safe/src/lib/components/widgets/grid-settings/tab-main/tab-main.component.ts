import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SafeAggregationService } from 'projects/safe/src/public-api';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';
import { AddAggregationModalComponent } from '../../../aggregation/add-aggregation-modal/add-aggregation-modal.component';
import { SafeEditAggregationModalComponent } from '../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component';

/**
 * Main tab of widget grid configuration modal.
 */
@Component({
  selector: 'safe-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent implements OnChanges {
  @Input() formGroup!: FormGroup;
  @Input() form: Form | null = null;
  @Input() resource: Resource | null = null;
  @Input() queries: any[] = [];
  @Input() templates: Form[] = [];

  public aggregation: any;

  /**
   * Constructor for tab-main component on grid-settings
   *
   * @param dialog Dialog service used to show edit/creation modals
   * @param aggregationService Aggregation service used to access and edit them.
   */
  constructor(
    private dialog: MatDialog,
    private aggregationService: SafeAggregationService
  ) {}

  /**
   * Updates the aggregation when the resource changes.
   */
  ngOnChanges() {
    if (this.resource && this.resource.id) {
      this.aggregationService
        .getAggregations(this.resource.id, {
          ids: [this.formGroup.value.aggregationId],
          first: 1,
        })
        .then((res) => {
          this.aggregation = res.edges[0].node;
        });
    }
  }

  /**
   * Adds a new aggregation to the list.
   */
  public addAggregation(): void {
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        aggregations: [this.aggregation],
        resource: this.resource,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log(value, this.formGroup);
        if (typeof value === 'string') {
          this.formGroup.get('aggregationId')?.setValue(value);
          if (this.resource && this.resource.id) {
            this.aggregationService
              .getAggregations(this.resource?.id, {
                ids: [value],
                first: 1,
              })
              .then((res) => {
                this.aggregation = res.edges[0].node;
              });
          }
        } else {
          this.formGroup.get('aggregationId')?.setValue(value.id);
          this.aggregation = value;
        }
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
    dialogRef.afterClosed().subscribe((value) => {
      if (value && this.aggregation) {
        this.aggregationService
          .editAggregation(this.aggregation, value, this.resource?.id)
          .subscribe((res) => {
            if (res.data) {
              this.aggregation = res.data.editAggregation;
            }
          });
      }
    });
  }

  /**
   * Removes the aggregation from the settings
   */
  public removeAggregation(): void {
    this.formGroup.get('aggregationId')?.setValue(null);
    this.aggregation = null;
  }
}
