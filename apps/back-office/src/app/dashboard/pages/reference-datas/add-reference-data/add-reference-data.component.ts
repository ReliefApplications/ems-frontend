import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

/**
 * New Reference Data modal.
 */
@Component({
  selector: 'app-add-reference-data',
  templateUrl: './add-reference-data.component.html',
  styleUrls: ['./add-reference-data.component.scss'],
})
export class AddReferenceDataComponent {
  /** Reference data reactive form group */
  referenceForm = this.fb.group({
    name: ['', Validators.required],
  });

  /** @returns name of reference data */
  get name(): AbstractControl | null {
    return this.referenceForm.get('name');
  }

  /**
   * New Reference Data modal.
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref.
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<AddReferenceDataComponent>
  ) {}
}
