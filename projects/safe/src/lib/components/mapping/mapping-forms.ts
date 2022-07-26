import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import get from 'lodash/get';
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
    field: [get(mapping, 'field', ''), Validators.required],
    path: [get(mapping, 'path', ''), Validators.required],
    value: [get(mapping, 'value', ''), Validators.required],
    text: [get(mapping, 'text', ''), Validators.required],
  });
