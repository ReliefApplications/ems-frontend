import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
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
export class AddApiConfigurationComponent {
  /** Api reactive form group */
  apiForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(apiValidator)]],
  });

  /** @returns name for the API configuration */
  get name(): AbstractControl | null {
    return this.apiForm.get('name');
  }

  /**
   * Add API configuration component
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<AddApiConfigurationComponent>
  ) {}
}
