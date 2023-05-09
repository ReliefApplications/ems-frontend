import { FormControl, FormGroup } from '@angular/forms';

/**
 * Extends the widget form with the common fields
 *
 * @param form widget form
 * @param settings settings to apply
 * @param settings.showBorder show border setting
 * @returns form with the common fields
 */
export const extendWidgetForm = (
  form: FormGroup,
  settings?: {
    showBorder?: boolean;
  }
) => {
  form.addControl(
    'widgetDisplay',
    new FormGroup({
      showBorder: new FormControl(settings?.showBorder ?? true),
    })
  );

  return form;
};
