import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mapping } from '../../models/setting.model';

/** Creating a new instance of the FormBuilder class. */
const formBuilder = new FormBuilder();

/**
 * Create a form group out of a mapping object.
 *
 * @param mapping Mapping object to transform.
 * @returns Form group.
 */
export const createFormGroup = (mapping: Mapping | null): FormGroup =>
  formBuilder.group({
    field: [mapping && mapping.field ? mapping.field : '', Validators.required],
    path: [mapping && mapping.path ? mapping.path : '', Validators.required],
    value: [mapping && mapping.value ? mapping.value : '', Validators.required],
    text: [mapping && mapping.text ? mapping.text : '', Validators.required],
  });
