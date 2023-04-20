import { TemplateRef } from '@angular/core';

/**
 * Table column definition interface
 */
export interface TableColumnDefinition {
  title: string;
  dataAccessor: string;
  template: TemplateRef<any> | string;
  sortable: boolean;
}
