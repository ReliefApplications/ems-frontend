import { PagerSettings } from '@progress/kendo-angular-grid';

/** Settings for pager */
export const PAGER_SETTINGS: PagerSettings = {
  buttonCount: 5,
  type: 'numeric',
  info: true,
  pageSizes: [10, 25, 50, 100],
  previousNext: true,
};
