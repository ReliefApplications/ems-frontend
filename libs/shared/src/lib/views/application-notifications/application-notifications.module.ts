import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationNotificationsComponent } from './application-notifications.component';
import { ApplicationNotificationsRoutingModule } from './application-notifications-routing.module';
import { SpinnerModule } from '@oort-front/ui';
import { NotificationsModule } from '../../components/notifications/notifications.module';

/**
 * Application custom notifications view module.
 */
@NgModule({
  declarations: [ApplicationNotificationsComponent],
  imports: [
    CommonModule,
    ApplicationNotificationsRoutingModule,
    SpinnerModule,
    NotificationsModule,
  ],
  exports: [ApplicationNotificationsComponent],
})
export class ApplicationNotificationsViewModule {}
