import { FormBuilder, Validators } from '@angular/forms';
import get from 'lodash/get';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';

export const createWidgetForm = (fb: FormBuilder, value: any) => {
  const settings = get(value, 'settings', {});
  const form = fb.group({
    id: [get(value, 'id')],
    title: [get(settings, 'title', '')],
    tabs: fb.array(
      (get(settings, 'tabs') || []).map((tab: any) => createTabForm(fb, tab))
    ),
  });
  const extendedForm = extendWidgetForm(form, settings.widgetDisplay);
  return extendedForm;
};
export type WidgetFormT = ReturnType<typeof createWidgetForm>;

export const createTabForm = (fb: FormBuilder, value?: any) => {
  const form = fb.group({
    label: [get(value, 'label', ''), Validators.required],
    type: [get(value, 'type'), Validators.required],
    content: [get(value, 'content'), Validators.required],
  });
  return form;
};
export type TabFormT = ReturnType<typeof createTabForm>;
