import { NgModule } from '@angular/core';
import { ProfileViewModule } from './profile/profile.module';
import { ApplicationDistributionListsViewModule } from './application-distribution-lists/application-distribution-lists.module';
import { ApplicationTemplatesViewModule } from './application-templates/application-templates.module';
import { ApplicationUsersViewModule } from './application-users/application-users.module';
import { ApplicationNotificationsViewModule } from './application-notifications/application-notifications.module';
import { EmailModule } from '../components/email/email.module';

/**
 * Export module of shared views.
 */
@NgModule({
  exports: [
    // General
    ProfileViewModule,
    // Application
    ApplicationDistributionListsViewModule,
    ApplicationTemplatesViewModule,
    ApplicationUsersViewModule,
    ApplicationNotificationsViewModule,
    EmailModule,
  ],
})
export class ViewsModule {}
