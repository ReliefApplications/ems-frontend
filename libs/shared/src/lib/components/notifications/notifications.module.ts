import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import {
  MenuModule,
  DividerModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
  TooltipModule,
} from '@oort-front/ui';
import { IconModule } from '@oort-front/ui';
import { EmptyModule } from '../ui/empty/empty.module';
import { StatusOptionsComponent } from '../status-options/status-options.component';

/**
 * Module for custom notifications table.
 */
@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    MenuModule,
    TranslateModule,
    SkeletonTableModule,
    DividerModule,
    IconModule,
    EmptyModule,
    PaginatorModule,
    ButtonModule,
    TableModule,
    StatusOptionsComponent,
    TooltipModule,
  ],
  exports: [NotificationsComponent],
})
export class NotificationsModule {}
