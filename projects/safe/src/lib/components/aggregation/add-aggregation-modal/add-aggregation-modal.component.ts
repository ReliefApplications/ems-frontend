import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Form } from '../../../models/form.model';
import { Resource } from '../../../models/resource.model';
import { SafeEditAggregationModalComponent } from '../edit-aggregation-modal/edit-aggregation-modal.component';
import { Aggregation } from '../../../models/aggregation.model';
import { SafeAggregationService } from '../../../services/aggregation/aggregation.service';
import {
  GetFormAggregationsResponse,
  GetResourceAggregationsResponse,
  GET_FORM_AGGREGATIONS,
  GET_RESOURCE_AGGREGATIONS,
} from './graphql/queries';
import { Apollo, QueryRef } from 'apollo-angular';
import { FormControl } from '@angular/forms';

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
export class AddAggregationModalComponent implements OnInit {
  private form?: Form;
  private resource?: Resource;
  public aggregations: Aggregation[] = [];
  public nextStep = false;

  public queryRef!:
    | QueryRef<GetResourceAggregationsResponse>
    | QueryRef<GetFormAggregationsResponse>
    | null;

  public selectedAggregationControl = new FormControl('');

  /**
   * Modal to add or select an aggregation.
   * Result of the action will be added to the component list that triggered the modal.
   *
   * @param dialogRef Material dialog reference
   * @param dialog Material dialog instance
   * @param apollo Apollo client service
   * @param data Data used by the modal
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private dialogRef: MatDialogRef<AddAggregationModalComponent>,
    private dialog: MatDialog,
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private aggregationService: SafeAggregationService
  ) {
    this.aggregations = data.aggregations;
    this.form = data.form;
    this.resource = data.resource;
  }

  ngOnInit(): void {
    if (this.resource)
      this.queryRef = this.apollo.watchQuery<GetResourceAggregationsResponse>({
        query: GET_RESOURCE_AGGREGATIONS,
        variables: {
          resource: this.resource?.id,
        },
      });
    else if (this.form)
      this.queryRef = this.apollo.watchQuery<GetFormAggregationsResponse>({
        query: GET_FORM_AGGREGATIONS,
        variables: {
          form: this.form?.id,
        },
      });

    // emits selected aggregation
    this.selectedAggregationControl.valueChanges.subscribe((value) => {
      if (!this.queryRef || !value) return;
      const currRes = this.queryRef.getCurrentResult() as any;
      const queryName = this.resource ? 'resource' : 'form';
      const selectedAggregation = currRes.data?.[
        queryName
      ]?.aggregations?.edges.find((edge: any) => edge.node.id === value)?.node;
      this.dialogRef.close(selectedAggregation);
    });
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
}
