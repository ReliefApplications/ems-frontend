import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { MenuModule, TableModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { DividerModule } from '@oort-front/ui';
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
    MenuModule,
    TranslateModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    DividerModule,
    MatIconModule,
    MatPaginatorModule,
    MatChipsModule,
    TableModule,
  ],
  exports: [NotificationsComponent],
})
export class NotificationsModule {}
