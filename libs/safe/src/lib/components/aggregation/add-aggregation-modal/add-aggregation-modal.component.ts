import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { Form } from '../../../models/form.model';
import { Resource } from '../../../models/resource.model';
import { SafeAggregationService } from '../../../services/aggregation/aggregation.service';
import {
  GetResourceAggregationsResponse,
  GET_RESOURCE_AGGREGATIONS,
} from './graphql/queries';
import { Apollo, QueryRef } from 'apollo-angular';
import { UntypedFormControl } from '@angular/forms';
import { SafeGraphQLSelectComponent } from '../../graphql-select/graphql-select.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeModalModule } from '../../ui/modal/modal.module';
import { SafeGraphQLSelectModule } from '../../../components/graphql-select/graphql-select.module';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Data needed for the dialog, should contain an aggregations array, a form and a resource
 */
interface DialogData {
  hasAggregations: boolean;
  form?: Form;
  resource?: Resource;
}

/**
 * Modal to add or select an aggregation.
 * Result of the action will be added to the component list that triggered the modal.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    SafeButtonModule,
    SafeModalModule,
    SafeGraphQLSelectModule,
    ReactiveFormsModule,
  ],
  selector: 'safe-add-aggregation-modal',
  templateUrl: './add-aggregation-modal.component.html',
  styleUrls: ['./add-aggregation-modal.component.scss'],
})
export class AddAggregationModalComponent implements OnInit {
  private form?: Form;
  private resource?: Resource;
  public hasAggregations = false;
  public nextStep = false;

  public queryRef!: QueryRef<GetResourceAggregationsResponse>;

  public selectedAggregationControl = new UntypedFormControl('');

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
    this.hasAggregations = data.hasAggregations;
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
  public async onCreate(): Promise<void> {
    const { SafeEditAggregationModalComponent } = await import(
      '../edit-aggregation-modal/edit-aggregation-modal.component'
    );
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
          .subscribe(({ data }) => {
            if (data?.addAggregation) {
              this.dialogRef.close(data.addAggregation);
            } else {
              this.dialogRef.close();
            }
          });
      }
    });
  }
}
