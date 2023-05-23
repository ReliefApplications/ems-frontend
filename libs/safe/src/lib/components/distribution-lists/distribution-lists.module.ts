import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionListsComponent } from './distribution-lists.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { MatIconModule } from '@angular/material/icon';
import {
  MenuModule,
  DividerModule,
  ButtonModule,
  TableModule,
} from '@oort-front/ui';

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
    MatIconModule,
    DividerModule,
    ButtonModule,
    TableModule,
  ],
  exports: [DistributionListsComponent],
})
export class DistributionListsModule {}
