import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SafeApplicationUsersModule } from '@safe/builder';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Application users page module.
 */
@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatProgressSpinnerModule,
    SafeApplicationUsersModule,
  ],
  exports: [UsersComponent],
})
export class UsersModule {}
