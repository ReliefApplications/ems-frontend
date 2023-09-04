import { FormBuilder, FormGroup } from '@angular/forms';
import get from 'lodash/get';

const fb = new FormBuilder();

export const createTabFormGroup = (value: any): FormGroup => {
  const formGroup = fb.group({
    structure: fb.control(value.structure),
  });
  return formGroup;
};

export const createTabsWidgetFormGroup = (
  id: string,
  configuration: any
): FormGroup => {
  const formGroup = fb.group({
    id,
    tabs: fb.array(
      (get(configuration, 'tabs') || []).map((x: any) => createTabFormGroup(x))
    ),
  });
  return formGroup;
};
