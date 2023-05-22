import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { MenuModule, DividerModule, ButtonModule } from '@oort-front/ui';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

/**
 * Module for custom notifications table.
 */
@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MenuModule,
    TranslateModule,
    SafeSkeletonTableModule,
    DividerModule,
    MatIconModule,
    MatPaginatorModule,
    MatChipsModule,
    ButtonModule,
  ],
  exports: [NotificationsComponent],
})
export class NotificationsModule {}
