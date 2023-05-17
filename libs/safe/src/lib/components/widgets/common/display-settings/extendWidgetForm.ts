import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
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
export const extendWidgetForm = <
  T extends { [key: string]: AbstractControl<any> }
>(
  form: FormGroup<T>,
  settings?: {
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
  (form as any).addControl('widgetDisplay', new FormGroup(controls));

  return form as any as FormGroup<
    T & { widgetDisplay: typeof widgetDisplayForm }
  >;
};
