import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';

/**
 * Grid Layout Interface.
 */
export interface GridLayout {
  fields?: any;
  filter?: CompositeFilterDescriptor;
  sort?: SortDescriptor[];
  showFilter?: boolean;
  actionsColWidth?: number;
}
