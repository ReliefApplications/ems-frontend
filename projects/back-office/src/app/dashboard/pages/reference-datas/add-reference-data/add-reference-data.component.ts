import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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
  referenceForm: FormGroup = new FormGroup({});

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
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddReferenceDataComponent>
  ) {}

  /**
   * Build the form.
   */
  ngOnInit(): void {
    this.referenceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z-_]+$')]],
    });
  }

  /**
   * Close the modal without sending data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
