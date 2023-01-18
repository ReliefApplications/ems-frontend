import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationNotificationsComponent } from './application-notifications.component';
import { SafeApplicationNotificationsRoutingModule } from './application-notifications-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationsModule } from '../../components/notifications/notifications.module';

/**
 * Application custom notifications view module.
 */
@NgModule({
  declarations: [SafeApplicationNotificationsComponent],
  imports: [
    CommonModule,
    SafeApplicationNotificationsRoutingModule,
    MatProgressSpinnerModule,
    NotificationsModule,
  ],
  exports: [SafeApplicationNotificationsComponent],
})
export class SafeApplicationNotificationsViewModule {}
