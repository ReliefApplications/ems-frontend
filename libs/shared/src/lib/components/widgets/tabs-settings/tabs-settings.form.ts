import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import get from 'lodash/get';

/** Form builder */
const fb = new FormBuilder();

/**
 * Create tab form group
 *
 * @param value initial value
 * @returns tab form group
 */
export const createTabFormGroup = (value?: any): FormGroup => {
  const formGroup = fb.group({
    label: fb.nonNullable.control<string>(value?.label, Validators.required),
    structure: fb.control(value?.structure || []),
  });
  return formGroup;
};

/**
 * Create tabs widget form group
 *
 * @param id widget id
 * @param value initial value
 * @returns tabs widget form group
 */
export const createTabsWidgetFormGroup = (
  id: string,
  value: any
): FormGroup => {
  const formGroup = fb.group({
    id,
    tabs: fb.array(
      (get(value, 'tabs') || []).map((x: any) => createTabFormGroup(x))
    ),
  });
  return formGroup;
};
