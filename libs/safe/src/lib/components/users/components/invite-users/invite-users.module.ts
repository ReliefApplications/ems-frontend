import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeInviteUsersComponent } from './invite-users.component';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { SafeAddUserModule } from '../add-user/add-user.module';
import { TranslateModule } from '@ngx-translate/core';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { ButtonModule as uiButtonModule } from '@oort-front/ui';

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
    SafeModalModule,
    uiButtonModule,
  ],
  exports: [SafeInviteUsersComponent],
})
export class SafeInviteUsersModule {}
