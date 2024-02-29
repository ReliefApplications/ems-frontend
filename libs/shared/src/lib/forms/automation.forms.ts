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

export const createAutomationComponentForm = (value: any) => {
  switch (value.component) {
    case 'trigger': {
      return fb.group({
        component: 'trigger',
        type: [get(value, 'type', null), Validators.required],
      });
    }
    case 'action':
    default: {
      // todo: more logic depending on type of action
      return fb.group({
        component: 'action',
        type: [get(value, 'type', null), Validators.required],
      });
    }
  }
};
