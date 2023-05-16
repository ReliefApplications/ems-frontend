import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionListsComponent } from './distribution-lists.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { MenuModule } from '@oort-front/ui';
import { MatIconModule } from '@angular/material/icon';
import { SafeButtonModule } from '../ui/button/button.module';
import { DividerModule, ButtonModule } from '@oort-front/ui';

/**
 * Module of distribution list table
 */
@NgModule({
  declarations: [DistributionListsComponent],
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    SafeSkeletonTableModule,
    MenuModule,
    MatIconModule,
    SafeButtonModule,
    DividerModule,
    ButtonModule,
  ],
  exports: [DistributionListsComponent],
})
export class DistributionListsModule {}
