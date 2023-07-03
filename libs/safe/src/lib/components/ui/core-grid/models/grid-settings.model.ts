import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

// TO-DO Finish it
/**
 * Grid Settings Interface.
 */
export interface GridSettings {
  id?: string;
  query?: {
    name: string;
    fields: any[];
    sort?: {
      field?: string;
      order?: 'asc' | 'desc';
    };
    filter?: CompositeFilterDescriptor;
  };
  actions?: {
    delete?: boolean;
    history?: boolean;
    convert?: boolean;
    update?: boolean;
    inlineEdition?: boolean;
    remove?: boolean;
  };
  // showDetails?: boolean;
  // showExport?: boolean;
  // showFilters?: boolean;
  defaultLayout?: any;
}
