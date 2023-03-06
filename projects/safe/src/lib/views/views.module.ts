import { NgModule } from '@angular/core';
import { SafeProfileViewModule } from './profile/profile.module';
import { SafeApplicationDistributionListsViewModule } from './application-distribution-lists/application-distribution-lists.module';
import { SafeApplicationTemplatesViewModule } from './application-templates/application-templates.module';
import { SafeApplicationUsersViewModule } from './application-users/application-users.module';

/**
 * Export module of shared views.
 */
@NgModule({
  exports: [
    // General
    SafeProfileViewModule,
    // Application
    SafeApplicationDistributionListsViewModule,
    SafeApplicationTemplatesViewModule,
    SafeApplicationUsersViewModule,
  ],
})
export class SafeViewsModule {}
