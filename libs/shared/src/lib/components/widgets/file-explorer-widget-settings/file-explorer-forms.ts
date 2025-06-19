import { FormBuilder, FormGroup } from '@angular/forms';
import get from 'lodash/get';

/** Angular Form Builder */
const fb = new FormBuilder();

/**
 * Create file explorer widget form group
 *
 * @param id Widget id
 * @param value Widget settings
 * @returns Form group
 */
export const createFileExplorerWidgetFormGroup = (
  id: any,
  value?: any
): FormGroup => {
  const formGroup = fb.group({
    id,
    title: [get(value, 'title', '')],
  });
  return formGroup;
};
