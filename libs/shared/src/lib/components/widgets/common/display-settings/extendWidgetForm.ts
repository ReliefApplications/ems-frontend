import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { get } from 'lodash';

/**
 * Extends the widget form with the common fields
 *
 * @param form widget form
 * @param settings settings to apply
 * @param settings.showBorder show border setting
 * @param settings.showHeader show border header
 * @param settings.hideEmpty hide empty widget on preview, front-office and web-widgets apps
 * @param settings.style custom style of the widget
 * @param settings.expandable show expand button
 * @param specificControls specific controls to add to the form, on a widget basis
 * @returns form with the common fields
 */
export const extendWidgetForm = <
  T extends { [key: string]: AbstractControl<any> },
  T2 extends { [key: string]: AbstractControl<any> }
>(
  form: FormGroup<T>,
  settings?: {
    showBorder?: boolean;
    showHeader?: boolean;
    hideEmpty?: boolean;
    expandable: boolean;
    style?: string;
  },
  specificControls?: T2
) => {
  const controls = {
    showBorder: new FormControl(get(settings, 'showBorder', true)),
    showHeader: new FormControl(get(settings, 'showHeader', true)),
    hideEmpty: new FormControl(get(settings, 'hideEmpty', false)),
    expandable: new FormControl(get(settings, 'expandable', false)),
    tooltip: new FormControl(get(settings, 'tooltip', null)),
    style: new FormControl(get(settings, 'style', '')),
  };
  Object.assign(controls, specificControls);
  (form as any).addControl('widgetDisplay', new FormGroup(controls));

  return form as any as FormGroup<
    T & {
      widgetDisplay: FormGroup<
        {
          showBorder: FormControl<boolean>;
          showHeader: FormControl<boolean>;
          hideEmpty: FormControl<boolean>;
          expandable: FormControl<boolean>;
          tooltip: FormControl<string>;
          style: FormControl<string>;
        } & T2
      >;
    }
  >;
};
