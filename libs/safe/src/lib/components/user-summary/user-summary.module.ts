import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUserSummaryComponent } from './user-summary.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { TranslateModule } from '@ngx-translate/core';
import { UserDetailsModule } from './user-details/user-details.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { SpinnerModule } from '@oort-front/ui';

/**
 * User Summary component module.
 */
@NgModule({
  declarations: [SafeUserSummaryComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    TranslateModule,
    UserDetailsModule,
    UserRolesModule,
    SpinnerModule,
  ],
  exports: [SafeUserSummaryComponent],
})
export class SafeUserSummaryModule {}
