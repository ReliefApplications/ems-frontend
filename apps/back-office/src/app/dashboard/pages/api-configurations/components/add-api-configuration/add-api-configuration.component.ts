import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { apiValidator } from '../../../../../utils/nameValidation';
import { Variant, Category } from '@oort-front/ui';

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
  apiForm: UntypedFormGroup = new UntypedFormGroup({});

  // === BUTTON ===
  public variant = Variant;
  public category = Category;

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
    private formBuilder: UntypedFormBuilder,
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
