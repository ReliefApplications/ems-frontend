import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UsersModule as SharedUsersModule } from '@oort-front/shared';

/** Users page module */
@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, UsersRoutingModule, SharedUsersModule],
  exports: [UsersComponent],
})
export class UsersModule {}
