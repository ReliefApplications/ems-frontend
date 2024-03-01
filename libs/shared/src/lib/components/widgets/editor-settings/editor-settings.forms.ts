import { FormBuilder, Validators } from '@angular/forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { v4 as uuidv4 } from 'uuid';
import { mutuallyExclusive } from '../../../utils/validators/mutuallyExclusive.validator';

/** Creating a new instance of the FormBuilder class. */
const fb = new FormBuilder();

/** Default context filter value. */
const DEFAULT_CONTEXT_FILTER = `{
  "logic": "and",
  "filters": []
}`;

/**
 * Create a new template aggregation form
 *
 * @param value previous value, if any
 * @returns form group
 */
export const createTemplateAggregationForm = (value: any) => {
  return fb.group(
    {
      id: get<string>(value, 'id', uuidv4()),
      name: get<string>(value, 'name', ''),
      resource: get<string>(value, 'resource', ''),
      referenceData: get<string>(value, 'referenceData', ''),
      aggregation: [get<string>(value, 'aggregation', ''), Validators.required],
      contextFilters: get<string>(value, 'contextFilters', '')
        ? get<string>(value, 'contextFilters', '')
        : DEFAULT_CONTEXT_FILTER,
      at: get<string>(value, 'at', ''),
      referenceDataVariableMapping: [
        get(value, 'referenceDataVariableMapping', null),
      ],
    },
    {
      validators: [
        mutuallyExclusive({
          required: true,
          fields: ['resource', 'referenceData'],
        }),
      ],
    }
  );
};

/**
 * Creates the form for the editor widget settings.
 *
 * @param id widget id
 * @param value editor widget
 * @returns the editor widget form group
 */
export const createEditorForm = (id: string, value: any) => {
  const form = fb.group(
    {
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
      aggregations: fb.array(
        get<any[]>(value, 'aggregations', []).map((aggregation: any) =>
          createTemplateAggregationForm(aggregation)
        )
      ),
    },
    {
      validators: [
        mutuallyExclusive({
          required: false,
          fields: ['resource', 'referenceData'],
        }),
      ],
    }
  );

  return extendWidgetForm(form, value.widgetDisplay, {
    usePadding: fb.control(
      get<boolean>(value, 'widgetDisplay.usePadding', true)
    ),
  });
};
