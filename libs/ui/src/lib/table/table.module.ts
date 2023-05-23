import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { TableWrapperDirective } from './table-wrapper.directive';
import { TableHeaderSortDirective } from './table-header-sort.directive';
import { CellDirective } from './cell.directive';
import { CellHeaderDirective } from './cell-header.directive';

/**
 * UI Table module
 */
@NgModule({
  declarations: [
    TableWrapperDirective,
    TableHeaderSortDirective,
    CellDirective,
    CellHeaderDirective,
  ],
  imports: [CommonModule, CdkTableModule],
  exports: [
    TableWrapperDirective,
    CdkTableModule,
    TableHeaderSortDirective,
    CellDirective,
    CellHeaderDirective,
  ],
})
export class TableModule {}
