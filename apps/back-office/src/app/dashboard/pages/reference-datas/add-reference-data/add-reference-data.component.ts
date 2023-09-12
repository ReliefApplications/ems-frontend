import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

/**
 * New Refence Data modal.
 */
@Component({
  selector: 'app-add-reference-data',
  templateUrl: './add-reference-data.component.html',
  styleUrls: ['./add-reference-data.component.scss'],
})
export class AddReferenceDataComponent {
  // === REACTIVE FORM ===
  referenceForm = this.fb.group({
    name: ['', Validators.required],
  });

  /** @returns name of reference data */
  get name(): AbstractControl | null {
    return this.referenceForm.get('name');
  }

  /**
   * New Refence Data modal.
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref.
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<AddReferenceDataComponent>
  ) {}

  /**
   * Close the modal without sending data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
