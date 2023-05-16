import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

/**
 * Extends the widget form with the common fields
 *
 * @param form widget form
 * @param settings settings to apply
 * @param settings.showBorder show border setting
 * @returns form with the common fields
 */
export const extendWidgetForm = <
  T extends { [key: string]: AbstractControl<any> }
>(
  form: FormGroup<T>,
  settings?: {
    showBorder?: boolean;
  }
) => {
  const widgetDisplayForm = new FormGroup({
    showBorder: new FormControl(settings?.showBorder ?? true),
  });

  (form as any).addControl('widgetDisplay', widgetDisplayForm);

  return form as any as FormGroup<
    T & { widgetDisplay: typeof widgetDisplayForm }
  >;
};
