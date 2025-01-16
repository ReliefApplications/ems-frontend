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
  update: {
    display: boolean;
    label?: string;
  };
  delete: {
    display: boolean;
    label?: string;
  };
  history: {
    display: boolean;
    label?: string;
  };
  convert: {
    display: boolean;
    label?: string;
  };
  remove: boolean;
  add?: boolean;
  export?: boolean;
  showDetails?: {
    display: boolean;
    label?: string;
  };
  showProgress?: boolean;
  navigateToPage?: boolean;
  navigateSettings?: {
    field: string;
    pageUrl: string;
    title: string;
    copyLink: boolean;
    copyLinkLabel?: string;
  };
  search?: boolean;
  inlineEdition?: boolean;
  mapSelected?: boolean;
  mapView?: boolean;
}
