import { FormBuilder } from '@angular/forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import get from 'lodash/get';
import isNil from 'lodash/isNil';

/** Creating a new instance of the FormBuilder class. */
const fb = new FormBuilder();

/**
 * Creates the form for the editor widget settings.
 *
 * @param id widget id
 * @param value editor widget
 * @returns the editor widget form group
 */
export const createEditorForm = (id: string, value: any) => {
  const form = fb.group({
    id,
    title: get<string>(value, 'title', ''),
    text: get<string>(value, 'text', ''),
    // for record selection
    resource: get<string | null>(value, 'resource', null),
    referenceData: get<string | null>(value, 'referenceData', null),
    layout: get<string | null>(value, 'layout', null),
    record: get<string | null>(value, 'record', null),
    element: get<string | null>(value, 'element', null),
    showDataSourceLink: [
      {
        value: get<boolean>(value, 'showDataSourceLink', false),
        disabled: !isNil(get<string | null>(value, 'referenceData', null)),
      },
    ],
    // Style
    useStyles: get<boolean>(value, 'useStyles', true),
    wholeCardStyles: get<boolean>(value, 'wholeCardStyles', false),
  });

  return extendWidgetForm(form, value?.settings?.widgetDisplay, {
    usePadding: fb.control(
      get<boolean>(value, 'widgetDisplay.usePadding', true)
    ),
  });
};