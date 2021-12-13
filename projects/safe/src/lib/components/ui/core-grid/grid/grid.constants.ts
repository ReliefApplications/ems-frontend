import { PagerSettings, SelectableSettings } from '@progress/kendo-angular-grid';
import { GradientSettings } from '@progress/kendo-angular-inputs';

export const MULTISELECT_TYPES: string[] = ['checkbox', 'tagbox', 'owner', 'users'];

export const PAGER_SETTINGS: PagerSettings = {
    buttonCount: 5,
    type: 'numeric',
    info: true,
    pageSizes: [10, 25, 50, 100],
    previousNext: true
};

export const SELECTABLE_SETTINGS: SelectableSettings = {
    enabled: true,
    checkboxOnly: true,
    mode: 'multiple',
    drag: false
};

export const GRADIENT_SETTINGS: GradientSettings = {
    opacity: false
};

export const EXPORT_SETTINGS = {
    records: 'all',
    fields: 'all',
    format: 'xlsx'
};
