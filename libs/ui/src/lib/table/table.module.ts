import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { TableWrapperDirective } from './table-wrapper.directive';
import { TableHeaderSortDirective } from './table-header-sort.directive';
import { CellDirective } from './cell.directive';
import { CellHeaderDirective } from './cell-header.directive';
import { SkeletonTableComponent } from './skeleton-table/skeleton-table.component';
import { CheckboxModule } from '../checkbox/checkbox.module'
import { ButtonModule } from '../button/button.module'
import { PaginatorModule } from '../paginator/paginator.module'
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

/**
 * UI Table module
 */
@NgModule({
  declarations: [
    TableWrapperDirective,
    TableHeaderSortDirective,
    CellDirective,
    CellHeaderDirective,
    SkeletonTableComponent,
  ],
  imports: [
    CommonModule,
    CdkTableModule,
    CheckboxModule,
    ButtonModule,
    PaginatorModule,
    TranslateModule,
    LayoutModule,
    ButtonsModule,
    IndicatorsModule
  ],
  exports: [
    TableWrapperDirective,
    CdkTableModule,
    TableHeaderSortDirective,
    CellDirective,
    CellHeaderDirective,
  ],
})
export class TableModule {}
