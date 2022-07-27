import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { SafeRolesComponent } from './roles.component';
import { SafeBackOfficeRolesModule } from './back-office-roles/back-office-roles.module';
import { SafeGroupsModule } from './groups/groups.module';

/**
 * SafeRolesModule manages modules and components for the roles page
 */
@NgModule({
  declarations: [SafeRolesComponent],
  imports: [
    CommonModule,
    SafeBackOfficeRolesModule,
    SafeGroupsModule,
    TranslateModule,
    MatTabsModule,
  ],
  exports: [SafeRolesComponent],
})
export class SafeRolesModule {}
