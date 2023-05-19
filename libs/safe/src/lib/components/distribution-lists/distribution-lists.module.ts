import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionListsComponent } from './distribution-lists.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { MenuModule, TableModule } from '@oort-front/ui';
import { MatIconModule } from '@angular/material/icon';
import { SafeButtonModule } from '../ui/button/button.module';
import { DividerModule } from '@oort-front/ui';

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
    SafeButtonModule,
    DividerModule,
    TableModule,
  ],
  exports: [DistributionListsComponent],
})
export class DistributionListsModule {}
