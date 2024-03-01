import { FormBuilder, Validators } from '@angular/forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { get } from 'lodash';

/** TODO: Replace once we have UI */
const DEFAULT_CONTEXT_FILTER = `{
    "logic": "and",
    "filters": []
  }`;

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
    contextFilters: [
      get(configuration, 'contextFilters', DEFAULT_CONTEXT_FILTER),
    ],
    at: get(configuration, 'at', ''),
  });

  return extendWidgetForm(formGroup, configuration?.widgetDisplay);
};
