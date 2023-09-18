import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionListsComponent } from './distribution-lists.component';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { IconModule } from '@oort-front/ui';
import {
  MenuModule,
  DividerModule,
  ButtonModule,
  TableModule,
} from '@oort-front/ui';
import { EmptyModule } from '../ui/empty/empty.module';

/**
 * Module of distribution list table
 */
@NgModule({
  declarations: [DistributionListsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonTableModule,
    MenuModule,
    IconModule,
    DividerModule,
    ButtonModule,
    EmptyModule,
    TableModule,
  ],
  exports: [DistributionListsComponent],
})
export class DistributionListsModule {}
