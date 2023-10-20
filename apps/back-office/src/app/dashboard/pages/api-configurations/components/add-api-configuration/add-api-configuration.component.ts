import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
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
  apiForm: UntypedFormGroup = new UntypedFormGroup({});

  /**
   * API configuration name getter
   *
   * @returns name for the API configuration
   */
  get name(): AbstractControl | null {
    return this.apiForm.get('name');
  }

  /**
   * Add API configuration component
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Dialog ref
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: DialogRef<AddApiConfigurationComponent>
  ) {}

  /** Build the form. */
  ngOnInit(): void {
    this.apiForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(apiValidator)]],
    });
  }
}
