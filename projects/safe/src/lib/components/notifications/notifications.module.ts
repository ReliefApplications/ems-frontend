import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { EditNotificationModalModule } from './components/edit-notification-modal/edit-notification-modal.module';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { SafeDividerModule } from '../ui/divider/divider.module';
import { MatIconModule } from '@angular/material/icon';

/**
 * Module for custom notifications table.
 */
@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    EditNotificationModalModule,
    MatTableModule,
    MatMenuModule,
    TranslateModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    SafeDividerModule,
    MatIconModule,
  ],
  exports: [NotificationsComponent],
})
export class NotificationsModule {}
