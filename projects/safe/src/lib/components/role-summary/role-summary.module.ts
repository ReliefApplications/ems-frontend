import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRoleSummaryComponent } from './role-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeSpinnerModule } from '../ui/spinner/spinner.module';
import { RoleChannelsModule } from './role-channels/role-channels.module';
import { RoleDetailsModule } from './role-details/role-details.module';
import { RoleFeaturesModule } from './role-features/role-features.module';

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
  ],
  exports: [SafeRoleSummaryComponent],
})
export class SafeRoleSummaryModule {}
