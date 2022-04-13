import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { SafeUserManagementModule } from '@safe/builder'
@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SafeUserManagementModule,
  ],
  exports: [UserManagementComponent],
})
export class UserManagementModule {}
