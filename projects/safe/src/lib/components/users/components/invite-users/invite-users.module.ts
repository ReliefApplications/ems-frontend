import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeInviteUsersComponent } from './invite-users.component';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { SafeAddUserModule } from '../add-user/add-user.module';
import { TranslateModule } from '@ngx-translate/core';
import { UploadsModule } from '@progress/kendo-angular-upload';

/** Module for invite users component */
@NgModule({
  declarations: [SafeInviteUsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    GroupModule,
    MatButtonModule,
    MatDialogModule,
    DropDownsModule,
    ButtonModule,
    ButtonsModule,
    SafeAddUserModule,
    TranslateModule,
    UploadsModule,
  ],
  exports: [SafeInviteUsersComponent],
})
export class SafeInviteUsersModule {}
