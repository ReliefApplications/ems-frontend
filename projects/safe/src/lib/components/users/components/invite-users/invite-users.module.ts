import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeInviteUsersComponent } from './invite-users.component';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    SafeInviteUsersComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    GroupModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [SafeInviteUsersComponent]
})
export class SafeInviteUsersModule { }
