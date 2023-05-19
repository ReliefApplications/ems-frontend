import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUserSummaryComponent } from './user-summary.component';
import { TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { UserDetailsModule } from './user-details/user-details.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { SafeSpinnerModule } from '../ui/spinner/spinner.module';

/**
 * User Summary component module.
 */
@NgModule({
  declarations: [SafeUserSummaryComponent],
  imports: [
    CommonModule,
    TabsModule,
    TranslateModule,
    UserDetailsModule,
    UserRolesModule,
    SafeSpinnerModule,
  ],
  exports: [SafeUserSummaryComponent],
})
export class SafeUserSummaryModule {}
