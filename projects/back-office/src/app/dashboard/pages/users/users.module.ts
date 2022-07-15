import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeUsersModule } from '@safe/builder';

/**
 * Module declaration for users component.
 */
@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatProgressSpinnerModule,
    SafeUsersModule,
  ],
  exports: [UsersComponent],
})
export class UsersModule {}
