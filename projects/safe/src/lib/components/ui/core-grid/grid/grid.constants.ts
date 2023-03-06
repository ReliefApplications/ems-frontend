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

/**
 * Kendo icons assigned to each file extension
 */
export const ICON_EXTENSIONS: any = {
  bmp: 'k-i-file-programming',
  csv: 'k-i-file-csv',
  doc: 'k-i-file-word',
  docm: 'k-i-file-word',
  docx: 'k-i-file-word',
  eml: 'k-i-file',
  epub: 'k-i-file',
  gif: 'k-i-file-video',
  gz: 'k-i-file-zip',
  htm: 'k-i-file-programming',
  html: 'k-i-file-programming',
  jpg: 'k-i-file-image',
  jpeg: 'k-i-file-image',
  msg: 'k-i-file',
  odp: 'k-i-file-presentation',
  odt: 'k-i-file-txt',
  ods: 'k-i-file-data',
  pdf: 'k-i-file-pdf',
  png: 'k-i-file-image',
  ppt: 'k-i-file-ppt',
  pptx: 'k-i-file-ppt',
  pptm: 'k-i-file-ppt',
  rtf: 'k-i-file-txt',
  txt: 'k-i-file-txt',
  xls: 'k-i-file-excel',
  xlsx: 'k-i-file-excel',
  xps: 'k-i-file',
  zip: 'k-i-file-zip',
  xlsm: 'k-i-file-excel',
  xml: 'k-i-file-excel',
};
