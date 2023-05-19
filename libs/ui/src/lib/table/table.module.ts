import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { TableWrapperDirective } from './table-wrapper.directive';
import { TableHeaderSortDirective } from './table-header-sort.directive';

/**
 * UI Table module
 */
@NgModule({
  declarations: [TableWrapperDirective, TableHeaderSortDirective],
  imports: [CommonModule, CdkTableModule],
  exports: [TableWrapperDirective, CdkTableModule, TableHeaderSortDirective],
})
export class TableModule {}
