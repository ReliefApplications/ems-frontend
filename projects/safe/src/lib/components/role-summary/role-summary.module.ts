import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRoleSummaryComponent } from './role-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeSpinnerModule } from '../ui/spinner/spinner.module';
import { RoleChannelsModule } from './role-channels/role-channels.module';
import { RoleDetailsModule } from './role-details/role-details.module';
import { RoleFeaturesModule } from './role-features/role-features.module';
import { RoleResourcesModule } from './role-resources/role-resources.module';
import { RoleAssignmentModule } from './role-assignment/role-assignment.module';

/**
 * Shared role summary component module.
 * Role summary displays role information and allows edition of role parameters.
 */
@NgModule({
  declarations: [SafeRoleSummaryComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    SafeSpinnerModule,
    RoleChannelsModule,
    RoleDetailsModule,
    RoleFeaturesModule,
    RoleResourcesModule,
    RoleAssignmentModule,
  ],
  exports: [SafeRoleSummaryComponent],
})
export class SafeRoleSummaryModule {}
