import {
  PagerSettings,
  SelectableSettings,
} from '@progress/kendo-angular-grid';
import { GradientSettings } from '@progress/kendo-angular-inputs';

/** Types of field that are multi-select */
export const MULTISELECT_TYPES: string[] = [
  'checkbox',
  'tagbox',
  'owner',
  'users',
];

/** Settings for pager */
export const PAGER_SETTINGS: PagerSettings = {
  buttonCount: 5,
  type: 'numeric',
  info: true,
  pageSizes: [10, 25, 50, 100],
  previousNext: true,
};

/** Settings for selection */
export const SELECTABLE_SETTINGS: SelectableSettings = {
  enabled: true,
  checkboxOnly: true,
  mode: 'multiple',
  drag: false,
};

/** Settings for gradient */
export const GRADIENT_SETTINGS: GradientSettings = {
  opacity: false,
};

/** Settings for exporting data */
export const EXPORT_SETTINGS = {
  records: 'all',
  fields: 'all',
  format: 'xlsx',
  email: false,
};
