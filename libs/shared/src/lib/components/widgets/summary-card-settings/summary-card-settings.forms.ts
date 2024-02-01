import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import get from 'lodash/get';
import { createGridActionsFormGroup } from '../grid-settings/grid-settings.forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import isNil from 'lodash/isNil';
import { mutuallyExclusive } from '../../../utils/validators/mutuallyExclusive.validator';

/** Creating a new instance of the FormBuilder class. */
const fb = new FormBuilder();

/**
 * Create a summary card form from definition
 *
 * @param id id of the widget
 * @param configuration Widget configuration
 * @returns Summary card widget form
 */
export const createSummaryCardForm = (id: string, configuration: any) => {
  const formGroup = fb.group(
    {
      id,
      title: get<string>(configuration, 'title', ''),
      card: createCardForm(get(configuration, 'card', null)),
      sortFields: new FormArray<any>([]),
      contextFilters: get<string>(
        configuration,
        'contextFilters',
        DEFAULT_CONTEXT_FILTER
      ),
      actions: createGridActionsFormGroup(configuration),
      at: get<string>(configuration, 'at', ''),
    },
    {
      validators: [templateRequiredWhenAddRecord],
    }
  );

  const isUsingAggregation = !!get(configuration, 'card.aggregation', null);
  const searchable = isUsingAggregation
    ? false
    : get<boolean>(configuration, 'widgetDisplay.searchable', false);

  const extendedForm = extendWidgetForm(
    formGroup,
    configuration?.widgetDisplay,
    {
      searchable: new FormControl(searchable),
      usePagination: new FormControl(
        get<boolean>(configuration, 'widgetDisplay.usePagination', false)
      ),
      usePadding: new FormControl(
        get<boolean>(configuration, 'widgetDisplay.usePadding', true)
      ),
      exportable: new FormControl(
        get<boolean>(configuration, 'widgetDisplay.exportable', true)
      ),
      gridMode: new FormControl(
        get<boolean>(configuration, 'widgetDisplay.gridMode', true)
      ),
      hideIfEmpty: new FormControl(
        get<boolean>(configuration, 'widgetDisplay.hideIfEmpty', false)
      ),
    }
  );

  // disable searchable if aggregation is selected
  if (isUsingAggregation)
    extendedForm.get('widgetDisplay.searchable')?.disable();

  return extendedForm;
};

// todo: put in common
/** Default context filter value. */
const DEFAULT_CONTEXT_FILTER = `{
  "logic": "and",
  "filters": []
}`;

/**
 * Validators for checking that a template is selected when configuring "add record" action.
 *
 * @param group form group
 * @returns validation errors
 */
export const templateRequiredWhenAddRecord = (
  group: AbstractControl
): ValidationErrors | null => {
  const templateControl = group.get('card.template');
  const addRecordControl = group.get('actions.addRecord');

  if (templateControl && addRecordControl) {
    const templateValue = templateControl.value;
    const addRecordValue = addRecordControl.value;

    if (addRecordValue && !templateValue) {
      addRecordControl.setErrors({
        missingTemplate: true,
      });
      return {
        actions: {
          addRecord: {
            missingTemplate: true,
          },
        },
      };
    } else {
      addRecordControl.setErrors(null);
    }
  }
  return null;
};

/**
 * Create a card form
 *
 * @param value card value, optional
 * @returns card as form group
 */
const createCardForm = (value?: any) => {
  const formGroup = fb.group(
    {
      title: get<string>(value, 'title', 'New Card'),
      referenceData: get<string | null>(value, 'referenceData', null),
      referenceDataVariableMapping: get<string | null>(
        value,
        'referenceDataVariableMapping',
        null
      ),
      resource: get<string | null>(value, 'resource', null),
      template: get<string | null>(value, 'template', null),
      layout: get<string | null>(value, 'layout', null),
      aggregation: get<string | null>(value, 'aggregation', null),
      html: get<string | null>(value, 'html', null),
      showDataSourceLink: [
        {
          value: get<boolean>(value, 'showDataSourceLink', false),
          disabled: !isNil(get<string | null>(value, 'referenceData', null)),
        },
      ],
      useStyles: get<boolean>(value, 'useStyles', true),
      wholeCardStyles: get<boolean>(value, 'wholeCardStyles', false),
      usePadding: get<boolean>(value, 'usePadding', true),
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
  if (formGroup.value.resource) {
    formGroup.addValidators(
      mutuallyExclusive({
        required: true,
        fields: ['layout', 'aggregation'],
      })
    );
  }
  formGroup.controls.resource.valueChanges.subscribe((value) => {
    if (value) {
      formGroup.addValidators(
        mutuallyExclusive({
          required: true,
          fields: ['layout', 'aggregation'],
        })
      );
    } else {
      formGroup.setValidators([
        mutuallyExclusive({
          required: true,
          fields: ['resource', 'referenceData'],
        }),
      ]);
    }
    formGroup.updateValueAndValidity();
  });
  return formGroup;
};
