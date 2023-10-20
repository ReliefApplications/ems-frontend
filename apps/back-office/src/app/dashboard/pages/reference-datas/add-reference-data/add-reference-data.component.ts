import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

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

  /**
   * Reference data name getter
   *
   * @returns name of reference data
   */
  get name(): AbstractControl | null {
    return this.referenceForm.get('name');
  }

  /**
   * New Reference Data modal.
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Dialog ref.
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: DialogRef<AddReferenceDataComponent>
  ) {}

  /**
   * Build the form.
   */
  ngOnInit(): void {
    this.referenceForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }
}
