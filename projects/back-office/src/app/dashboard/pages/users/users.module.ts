import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WhoUsersModule } from '@who-ems/builder';
@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatProgressSpinnerModule,
    WhoUsersModule
  ],
  exports: [
    UsersComponent
  ]
})
export class UsersModule { }
