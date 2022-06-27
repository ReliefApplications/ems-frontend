import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUserSummaryComponent } from './user-summary.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { UserDetailsModule } from './user-details/user-details.module';
import { UserRolesModule } from './user-roles/user-roles.module';

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
  ],
  exports: [SafeUserSummaryComponent],
})
export class SafeUserSummaryModule {}
