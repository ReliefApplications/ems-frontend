import { FormBuilder, Validators } from '@angular/forms';
import { get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const fb = new FormBuilder();

export const createAutomationForm = (value?: any) => {
  return fb.group({
    id: [get(value, 'id', uuidv4()), Validators.required],
    name: [get(value, 'name', null), Validators.required],
    components: fb.array<ReturnType<typeof createAutomationComponentForm>>(
      get(value, 'components', []).map((component: any) =>
        createAutomationComponentForm(component)
      )
    ),
  });
};

export const createAutomationActionComponentForm = (
  type: string,
  value: any
) => {
  switch (type) {
    case 'add.layer':
    case 'remove.layer': {
      return fb.group({
        widget: [get(value, 'widget', null), Validators.required],
        layers: [get(value, 'layers', null), Validators.required],
      });
    }
    default: {
      return fb.group({});
    }
  }
};

export const createAutomationComponentForm = (value: any) => {
  switch (value.component) {
    case 'trigger': {
      return fb.group({
        component: 'trigger',
        type: [get(value, 'type', null), Validators.required],
        value: fb.group({}),
      });
    }
    case 'action':
    default: {
      // todo: more logic depending on type of action
      return fb.group({
        component: 'action',
        type: [get(value, 'type', null), Validators.required],
        value: createAutomationActionComponentForm(
          get(value, 'type', null),
          get(value, 'value', null)
        ),
      });
    }
  }
};
