import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { SortField } from '../../../../services/query-builder/query-builder.service';

// TO-DO Finish it
/**
 * Grid Settings Interface.
 */
export interface GridSettings {
  id?: string;
  query?: {
    name: string;
    fields: any[];
    sort?: SortField[];
    filter?: CompositeFilterDescriptor;
  };
  actions?: GridActions;
  // showDetails?: boolean;
  // showExport?: boolean;
  // showFilters?: boolean;
  defaultLayout?: any;
}

/** Related grid actions */
export interface GridActions {
  update: boolean;
  delete: boolean;
  history: boolean;
  convert: boolean;
  remove: boolean;
  add?: boolean;
  export?: boolean;
  showDetails?: boolean;
  navigateToPage?: boolean;
  navigateSettings?: {
    field: string;
    pageUrl: string;
    title: string;
    copyLink: boolean;
  };
  search?: boolean;
  inlineEdition?: boolean;
  mapSelected?: boolean;
  mapView?: boolean;
  actionsAsIcons?: boolean;
}
