import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleSummaryComponent } from './role-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerModule, TabsModule } from '@oort-front/ui';
import { RoleChannelsModule } from './role-channels/role-channels.module';
import { RoleDetailsModule } from './role-details/role-details.module';
import { RoleFeaturesModule } from './role-features/role-features.module';
import { RoleResourcesModule } from './role-resources/role-resources.module';
import { RoleAutoAssignmentModule } from './role-auto-assignment/role-auto-assignment.module';

/**
 * Shared role summary component module.
 * Role summary displays role information and allows edition of role parameters.
 */
@NgModule({
  declarations: [RoleSummaryComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SpinnerModule,
    TabsModule,
    RoleChannelsModule,
    RoleDetailsModule,
    RoleFeaturesModule,
    RoleResourcesModule,
    RoleAutoAssignmentModule,
  ],
  exports: [RoleSummaryComponent],
})
export class RoleSummaryModule {}
