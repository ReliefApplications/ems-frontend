import { FormBuilder, Validators } from '@angular/forms';
import { get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  ActionType,
  ActionValue,
  ActionWithValue,
} from '../models/automation.model';

/** Form builder */
const fb = new FormBuilder();

/**
 * Create a new automation rule form
 *
 * @param value value of automation rule
 * @returns form group
 */
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

/**
 * Create a new automation action component form
 *
 * @param type type of action
 * @param value automation component value
 * @returns form group
 */
export const createAutomationActionComponentForm = (
  type: ActionType,
  value: ActionValue | null
) => {
  switch (type) {
    case ActionType.setContext: {
      return fb.group({
        mapping: [get(value, 'mapping', ''), Validators.required],
      });
    }
    case ActionType.addLayer:
    case ActionType.removeLayer: {
      return fb.group({
        widget: [get(value, 'widget', null), Validators.required],
        layers: [get(value, 'layers', null), Validators.required],
      });
    }
    case ActionType.addTab:
    case ActionType.removeTab: {
      return fb.group({
        widget: [get(value, 'widget', null), Validators.required],
        tabs: [get(value, 'tabs', null), Validators.required],
      });
    }
    case ActionType.openTab: {
      return fb.group({
        widget: [get(value, 'widget', null), Validators.required],
        tab: [get(value, 'tab', null), Validators.required],
      });
    }
    case ActionType.displayCollapse:
    case ActionType.displayExpand: {
      return fb.group({
        widget: [get(value, 'widget', null), Validators.required],
      });
    }
    default: {
      return fb.group({});
    }
  }
};

/**
 * Create a new automation component form
 *
 * @param value value of automation component
 * @returns form group
 */
export const createAutomationComponentForm = (value: ActionWithValue) => {
  const type = get(value, 'type', null);
  const relatedName = get(value, 'relatedName', '');
  switch (value.component) {
    case 'trigger': {
      return fb.group({
        component: 'trigger',
        type: [type, Validators.required],
        relatedName: relatedName,
        value: fb.group({}),
      });
    }
    case 'action':
    default: {
      // todo: more logic depending on type of action
      return fb.group({
        component: 'action',
        type: [type, Validators.required],
        relatedName: relatedName,
        value: type
          ? createAutomationActionComponentForm(type, get(value, 'value', null))
          : fb.group({}),
      });
    }
  }
};
