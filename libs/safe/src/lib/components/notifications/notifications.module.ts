import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import {
  MenuModule,
  DividerModule,
  ButtonModule,
  TableModule,
  ChipModule,
  PaginatorModule,
  TooltipModule,
} from '@oort-front/ui';
import { IconModule } from '@oort-front/ui';
import { SafeEmptyModule } from '../ui/empty/empty.module';

/**
 * Module for custom notifications table.
 */
@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    MenuModule,
    TranslateModule,
    SafeSkeletonTableModule,
    DividerModule,
    IconModule,
    SafeEmptyModule,
    PaginatorModule,
    ButtonModule,
    TableModule,
    ChipModule,
    TooltipModule,
  ],
  exports: [NotificationsComponent],
})
export class NotificationsModule {}
