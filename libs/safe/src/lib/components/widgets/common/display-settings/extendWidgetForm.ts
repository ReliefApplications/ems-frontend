import { FormControl, FormGroup } from '@angular/forms';
import { get } from 'lodash';

/**
 * Extends the widget form with the common fields
 *
 * @param form widget form
 * @param settings settings to apply
 * @param settings.showBorder show border setting
 * @param specificControls specific controls to add to the form, on a widget basis
 * @returns form with the common fields
 */
export const extendWidgetForm = (
  form: FormGroup,
  settings: {
    showBorder?: boolean;
  },
  specificControls?: {
    [key: string]: FormControl;
  }
) => {
  const controls = {
    showBorder: new FormControl(get(settings, 'showBorder', true)),
  };
  Object.assign(controls, specificControls);
  form.addControl('widgetDisplay', new FormGroup(controls));

  return form;
};
