import { FormBuilder, Validators } from '@angular/forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { get } from 'lodash';

/** Creating a new instance of the FormBuilder class. */
const fb = new FormBuilder();

/**
 * Create a form widget form group.
 *
 * @param id id of the widgetS
 * @param configuration previous configuration
 * @returns form group
 */
export const createFormWidgetFormGroup = (id: string, configuration: any) => {
  const formGroup = fb.group({
    id,
    title: [get(configuration, 'title', ''), Validators.required],
    form: [get(configuration, 'form', null), Validators.required],
  });

  return extendWidgetForm(formGroup, configuration?.widgetDisplay);
};
