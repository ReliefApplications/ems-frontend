import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SafeUsersModule } from '@oort-front/safe';
import { PaginatorModule } from '@oort-front/ui';

/** Users page module */
@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, UsersRoutingModule, SafeUsersModule, PaginatorModule],
  exports: [UsersComponent],
})
export class UsersModule {}
