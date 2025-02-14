import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSummaryComponent } from './user-summary.component';
import { TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { UserDetailsModule } from './user-details/user-details.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { SpinnerModule } from '@oort-front/ui';
import { ActivityLogModule as ApplicationActivityLogModule } from '../activity-log/activity-log.module';

/**
 * User Summary component module.
 */
@NgModule({
  declarations: [UserSummaryComponent],
  imports: [
    CommonModule,
    TabsModule,
    TranslateModule,
    UserDetailsModule,
    UserRolesModule,
    SpinnerModule,
    ApplicationActivityLogModule,
  ],
  exports: [UserSummaryComponent],
})
export class UserSummaryModule {}
