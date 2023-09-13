import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionListsComponent } from './distribution-lists.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { IconModule, TooltipModule } from '@oort-front/ui';
import {
  MenuModule,
  DividerModule,
  ButtonModule,
  TableModule,
} from '@oort-front/ui';
import { SafeEmptyModule } from '../ui/empty/empty.module';

/**
 * Module of distribution list table
 */
@NgModule({
  declarations: [DistributionListsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SafeSkeletonTableModule,
    MenuModule,
    IconModule,
    DividerModule,
    ButtonModule,
    SafeEmptyModule,
    TableModule,
    TooltipModule,
  ],
  exports: [DistributionListsComponent],
})
export class DistributionListsModule {}
