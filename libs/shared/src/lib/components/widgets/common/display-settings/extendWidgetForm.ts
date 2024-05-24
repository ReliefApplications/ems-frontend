import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
 * @param settings.tooltip tooltip settings
 * @param settings.tooltip.display whether to display the tooltip
 * @param settings.tooltip.title tooltip title, if any
 * @param settings.tooltip.content tooltip content
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
    tooltip?: {
      display: boolean;
      title?: string;
      content: string;
    };
    style?: string;
  },
  specificControls?: T2
) => {
  const controls = {
    showBorder: new FormControl(get(settings, 'showBorder', true)),
    showHeader: new FormControl(get(settings, 'showHeader', true)),
    hideEmpty: new FormControl(get(settings, 'hideEmpty', false)),
    expandable: new FormControl(get(settings, 'expandable', false)),
    tooltip: new FormGroup({
      display: new FormControl(get(settings, 'tooltip.display', false)),
      title: new FormControl(get(settings, 'tooltip.title', '')),
      content: new FormControl(get(settings, 'tooltip.content', '')),
    }),
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
          tooltip: FormGroup<{
            display: FormControl<boolean>;
            title: FormControl<string>;
            content: FormControl<string>;
          }>;
          style: FormControl<string>;
        } & T2
      >;
    }
  >;
};
