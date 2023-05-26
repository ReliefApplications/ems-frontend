import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSkeletonTableComponent } from './skeleton-table.component';
import { SafeAccessModule } from '../../access/access.module';
import { MatSortModule } from '@angular/material/sort';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';
import {
  CheckboxModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
} from '@oort-front/ui';

/** Skeleton table module */
@NgModule({
  declarations: [SafeSkeletonTableComponent],
  imports: [
    CommonModule,
    SafeAccessModule,
    MatSortModule,
    PaginatorModule,
    IndicatorsModule,
    LayoutModule,
    ButtonsModule,
    TranslateModule,
    CheckboxModule,
    ButtonModule,
    TableModule,
  ],
  exports: [SafeSkeletonTableComponent],
})
export class SafeSkeletonTableModule {}
