import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { SafeDividerModule } from '../ui/divider/divider.module';
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
    MatMenuModule,
    TranslateModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    SafeDividerModule,
    MatIconModule,
    MatPaginatorModule,
    MatChipsModule,
  ],
  exports: [NotificationsComponent],
})
export class NotificationsModule {}
