import { FormBuilder, FormGroup } from '@angular/forms';
import get from 'lodash/get';
import { createFilterGroup } from '../../query-builder/query-builder-forms';

/** Angular Form Builder */
const fb = new FormBuilder();

/** TODO: Replace once we have UI */
const DEFAULT_CONTEXT_FILTER = `{}`;

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
    tags: [get(value, 'tags', [])] as string[],
    contextFilters: [get(value, 'contextFilters', DEFAULT_CONTEXT_FILTER)],
    filter: createFilterGroup(get(value, 'filter', null)),
    // form binding
    resource: [get(value, 'resource', null)],
    template: [get(value, 'template', null)],
    accessRequestForm: fb.group({
      recipients: [get(value, 'accessRequestForm.recipients', [])],
      subject: [get(value, 'accessRequestForm.subject', '')],
      body: [get(value, 'accessRequestForm.body', '')],
    }),
  });
  return formGroup;
};
