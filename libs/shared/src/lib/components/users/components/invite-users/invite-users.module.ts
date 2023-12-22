import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteUsersComponent } from './invite-users.component';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { AddUserModule } from '../add-user/add-user.module';
import { TranslateModule } from '@ngx-translate/core';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { ButtonModule as uiButtonModule, TextareaModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';

/** Module for invite users component */
@NgModule({
  declarations: [InviteUsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    GroupModule,
    DropDownsModule,
    ButtonModule,
    ButtonsModule,
    AddUserModule,
    TranslateModule,
    UploadsModule,
    DialogModule,
    TextareaModule,
    uiButtonModule,
  ],
  exports: [InviteUsersComponent],
})
export class InviteUsersModule {}
