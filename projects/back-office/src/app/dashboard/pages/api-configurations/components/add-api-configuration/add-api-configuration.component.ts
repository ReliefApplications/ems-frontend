import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { apiValidator } from '../../../../../utils/nameValidation';

/**
 * Add API configuration component (modal)
 */
@Component({
  selector: 'app-add-api-configuration',
  templateUrl: './add-api-configuration.component.html',
  styleUrls: ['./add-api-configuration.component.scss'],
})
export class AddApiConfigurationComponent implements OnInit {
  // === REACTIVE FORM ===
  apiForm: FormGroup = new FormGroup({});

  /** @returns name for the API configuration */
  get name(): AbstractControl | null {
    return this.apiForm.get('name');
  }

  /**
   * Add API configuration component
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Material dialog ref
   */
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddApiConfigurationComponent>
  ) {}

  /** Build the form. */
  ngOnInit(): void {
    this.apiForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(apiValidator)]],
    });
  }

  /** Close the modal without sending data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
