import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  if (configuration.mapQuestionState && configuration.mapQuestionState.length) {
    (formGroup as FormGroup).addControl(
      'mapQuestionState',
      fb.array(
        configuration.mapQuestionState.map((x: any) =>
          createQuestionValueToStateFormGroup(x)
        )
      ) as FormArray<FormControl<typeof createQuestionValueToStateFormGroup>>
    );
  }
  return extendWidgetForm(formGroup, configuration?.widgetDisplay);
};

/**
 * Mapping question to state form factory.
 *
 * @param value default value ( if any )
 * @returns new form group for the question to state mapping button.
 */
export const createQuestionValueToStateFormGroup = (value: any) => {
  const formGroup = fb.group({
    question: [get(value, 'question', null)],
    state: [get(value, 'state', null)],
  });
  return formGroup;
};
