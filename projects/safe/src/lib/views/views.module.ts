import { NgModule } from '@angular/core';
import { SafeProfileViewModule } from './profile/profile.module';
import { SafeApplicationDistributionListsViewModule } from './application-distribution-lists/application-distribution-lists.module';
import { SafeApplicationTemplatesViewModule } from './application-templates/application-templates.module';

/**
 * Export module of shared views.
 */
@NgModule({
  exports: [
    SafeProfileViewModule,
    SafeApplicationDistributionListsViewModule,
    SafeApplicationTemplatesViewModule,
  ],
})
export class SafeViewsModule {}
