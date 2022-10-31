import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
  GetResourceAggregationsResponse,
  GET_RESOURCE_AGGREGATIONS,
} from './graphql/queries';
import { Apollo, QueryRef } from 'apollo-angular';
import { FormControl } from '@angular/forms';
import { SafeGraphQLSelectComponent } from '../../graphql-select/graphql-select.component';

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

  public queryRef!: QueryRef<GetResourceAggregationsResponse>;

  public selectedAggregationControl = new FormControl('');

  /** Reference to graphql select for layout */
  @ViewChild(SafeGraphQLSelectComponent)
  aggregationSelect?: SafeGraphQLSelectComponent;

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
    this.queryRef = this.apollo.watchQuery<GetResourceAggregationsResponse>({
      query: GET_RESOURCE_AGGREGATIONS,
      variables: {
        resource: this.resource?.id,
      },
    });

    // emits selected aggregation
    this.selectedAggregationControl.valueChanges.subscribe((value) => {
      if (value) {
        this.dialogRef.close(
          this.aggregationSelect?.elements
            .getValue()
            .find((x) => x.id === value)
        );
      }
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
