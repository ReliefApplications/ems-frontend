import { FormBuilder, Validators } from '@angular/forms';
import { get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const fb = new FormBuilder();

export const createAutomationForm = (value?: any) => {
  return fb.group({
    id: [get(value, 'id', uuidv4()), Validators.required],
    name: [get(value, 'name', null), Validators.required],
    components: fb.array([]),
  });
};
