import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationNotificationsComponent } from './application-notifications.component';
import { SafeApplicationNotificationsRoutingModule } from './application-notifications-routing.module';
import { SpinnerModule } from '@oort-front/ui';
import { NotificationsModule } from '../../components/notifications/notifications.module';

/**
 * Application custom notifications view module.
 */
@NgModule({
  declarations: [SafeApplicationNotificationsComponent],
  imports: [
    CommonModule,
    SafeApplicationNotificationsRoutingModule,
    SpinnerModule,
    NotificationsModule,
  ],
  exports: [SafeApplicationNotificationsComponent],
})
export class SafeApplicationNotificationsViewModule {}
