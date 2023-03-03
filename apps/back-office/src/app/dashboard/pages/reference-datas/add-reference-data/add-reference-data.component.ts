import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

/**
 * New Refence Data modal.
 */
@Component({
  selector: 'app-add-reference-data',
  templateUrl: './add-reference-data.component.html',
  styleUrls: ['./add-reference-data.component.scss'],
})
export class AddReferenceDataComponent implements OnInit {
  // === REACTIVE FORM ===
  referenceForm: UntypedFormGroup = new UntypedFormGroup({});

  /** @returns name of reference data */
  get name(): AbstractControl | null {
    return this.referenceForm.get('name');
  }

  /**
   * New Refence Data modal.
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Material dialog ref.
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddReferenceDataComponent>
  ) {}

  /**
   * Build the form.
   */
  ngOnInit(): void {
    this.referenceForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  /**
   * Close the modal without sending data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
