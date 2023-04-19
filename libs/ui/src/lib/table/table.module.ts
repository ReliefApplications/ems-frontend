import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { TableComponent } from './table.component';
import { PagerModule } from '@progress/kendo-angular-pager';

/**
 * UI Table module
 */
@NgModule({
  declarations: [TableComponent],
  imports: [CommonModule, CdkTableModule, PagerModule],
  exports: [TableComponent],
})
export class TableModule {}
