import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonTableComponent } from './skeleton-table.component';
import { AccessModule } from '../../access/access.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';
import {
  CheckboxModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
  TooltipModule,
} from '@oort-front/ui';

/** Skeleton table module */
@NgModule({
  declarations: [SkeletonTableComponent],
  imports: [
    CommonModule,
    AccessModule,
    PaginatorModule,
    IndicatorsModule,
    ButtonsModule,
    TranslateModule,
    CheckboxModule,
    ButtonModule,
    TableModule,
    TooltipModule,
  ],
  exports: [SkeletonTableComponent],
})
export class SkeletonTableModule {}
