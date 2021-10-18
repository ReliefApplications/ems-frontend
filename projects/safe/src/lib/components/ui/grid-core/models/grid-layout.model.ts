import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';

export interface GridLayout {
    fields?: any;
    filter?: CompositeFilterDescriptor;
    sort?: SortDescriptor[];
    showFilter?: boolean;
}
