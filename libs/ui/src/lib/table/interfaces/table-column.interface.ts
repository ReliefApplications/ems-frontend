import { Type } from '@angular/core';

/**
 * Table column definition interface
 */
export interface TableColumnDefinition {
  title: string;
  dataAccessor: string;
  template: Type<any> | string;
  sortable: boolean;
}
