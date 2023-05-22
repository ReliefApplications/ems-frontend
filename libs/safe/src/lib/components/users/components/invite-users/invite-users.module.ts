import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeInviteUsersComponent } from './invite-users.component';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { SafeAddUserModule } from '../add-user/add-user.module';
import { TranslateModule } from '@ngx-translate/core';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { ButtonModule as uiButtonModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';

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
    DropDownsModule,
    ButtonModule,
    ButtonsModule,
    SafeAddUserModule,
    TranslateModule,
    UploadsModule,
    DialogModule,
    uiButtonModule,
  ],
  exports: [SafeInviteUsersComponent],
})
export class SafeInviteUsersModule {}
