import { Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Aggregation } from '../../../models/aggregation.model';
import { Resource } from '../../../models/resource.model';
import { createAggregationForm } from '../../ui/aggregation-builder/aggregation-builder-forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@oort-front/ui';
import { AggregationBuilderModule } from '../../ui/aggregation-builder/aggregation-builder.module';
import {
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { ReferenceData } from '../../../models/reference-data.model';

/**
 * Interface describing the structure of the data displayed in the dialog
 */
interface DialogData {
  aggregation?: Aggregation;
  resource?: Resource;
  referenceData?: ReferenceData;
}

/**
 * Modal to edit aggregation.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    DialogModule,
    AggregationBuilderModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  selector: 'shared-edit-aggregation-modal',
  templateUrl: './edit-aggregation-modal.component.html',
  styleUrls: ['./edit-aggregation-modal.component.scss'],
})
export class EditAggregationModalComponent {
  /** Form group */
  public formGroup!: UntypedFormGroup;
  /** Current resource */
  public resource?: Resource;
  /** Current reference data */
  public referenceData?: ReferenceData;

  /**
   * Modal to edit aggregation.
   *
   * @param dialogRef This is the reference of the dialog that will be opened.
   * @param data This is the data that is passed to the modal when it is opened.
   */
  constructor(
    public dialogRef: DialogRef<EditAggregationModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    this.resource = this.data.resource;
    this.referenceData = this.data.referenceData;
    this.formGroup = createAggregationForm(this.data.aggregation);
  }

  /**
   * Closes the modal sending form value.
   */
  onSubmit(): void {
    const aggregationData = this.formGroup?.getRawValue();
    delete aggregationData.id;
    this.dialogRef.close(aggregationData);
  }
}
