import { PagerSettings, SelectableSettings } from '@progress/kendo-angular-grid';

export const MULTISELECT_TYPES: string[] = ['checkbox', 'tagbox', 'owner', 'users'];

export const PAGER_SETTINGS: PagerSettings = {
    buttonCount: 5,
    type: 'numeric',
    info: true,
    pageSizes: true,
    previousNext: true
};

export const SELECTABLE_SETTINGS: SelectableSettings = {
    checkboxOnly: true,
    mode: 'multiple',
    drag: false
};
