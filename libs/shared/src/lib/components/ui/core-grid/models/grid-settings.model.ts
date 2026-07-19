import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { LocalizedString } from '../../../../models/localized-string.model';

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
  import?: boolean;
  showDetails?: boolean;
  navigateToPage?: boolean;
  navigateSettings?: {
    field: string;
    pageUrl: string;
    title: LocalizedString;
  };
  search?: boolean;
  inlineEdition?: boolean;
  /** List of field names that should stay read-only during inline edition */
  readOnlyFields?: string[];
  /** Whether files flagged as outdated should be rendered in file columns */
  showOutdatedFiles?: boolean;
}
