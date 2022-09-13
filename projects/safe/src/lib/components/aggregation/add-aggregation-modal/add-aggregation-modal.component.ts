import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Form } from '../../../models/form.model';
import { Resource } from '../../../models/resource.model';
import { SafeEditAggregationModalComponent } from '../edit-aggregation-modal/edit-aggregation-modal.component';
import { Aggregation } from '../../../models/aggregation.model';
import { SafeAggregationService } from '../../../services/aggregation/aggregation.service';

/**
 * Data needed for the dialog, should contain an aggregations array, a form and a resource
 */
interface DialogData {
  aggregations: Aggregation[];
  form?: Form;
  resource?: Resource;
}

/**
 * Modal to add or select an aggregation.
 * Result of the action will be added to the component list that triggered the modal.
 */
@Component({
  selector: 'safe-add-aggregation-modal',
  templateUrl: './add-aggregation-modal.component.html',
  styleUrls: ['./add-aggregation-modal.component.scss'],
})
export class AddAggregationModalComponent {
  private form?: Form;
  private resource?: Resource;
  public aggregations: Aggregation[] = [];
  public nextStep = false;

  /**
   * Modal to add or select an aggregation.
   * Result of the action will be added to the component list that triggered the modal.
   *
   * @param dialogRef Material dialog reference
   * @param dialog Material dialog instance
   * @param data Data used by the modal
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private dialogRef: MatDialogRef<AddAggregationModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private aggregationService: SafeAggregationService
  ) {
    this.aggregations = data.aggregations;
    this.form = data.form;
    this.resource = data.resource;
  }

  /**
   * Opens the panel to create a new aggregation.
   */
  public onCreate(): void {
    const dialogRef = this.dialog.open(SafeEditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
      },
    });
    dialogRef.afterClosed().subscribe((aggregation) => {
      if (aggregation) {
        this.aggregationService
          .addAggregation(aggregation, this.resource?.id, this.form?.id)
          .subscribe((res) => {
            if (res.data?.addAggregation) {
              this.dialogRef.close(res.data.addAggregation);
            } else {
              this.dialogRef.close();
            }
          });
      }
    });
  }

  /**
   * Selects an existing aggregation.
   *
   * @param choice aggregation choice.
   */
  public onSelect(choice: MatSelectChange): void {
    this.dialogRef.close(choice.value);
  }
}
