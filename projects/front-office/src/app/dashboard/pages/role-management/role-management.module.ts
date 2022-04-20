import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleManagementRoutingModule } from './role-management-routing.module';
import { RoleManagementComponent } from './role-management.component';
import { SafeRoleManagementModule } from '@safe/builder';

@NgModule({
  declarations: [RoleManagementComponent],
  imports: [
    CommonModule,
    RoleManagementRoutingModule,
    SafeRoleManagementModule,
  ],
  exports: [RoleManagementComponent],
})
export class RoleManagementModule {}
