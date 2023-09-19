import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleDetailsComponent } from './role-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleUsersModule } from '../role-users/role-users.module';
import {
  TabsModule,
  ButtonModule,
  TextareaModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';

/**
 * General tab of Role Summary.
 * Contain title / description of role + list of users and permissions.
 */
@NgModule({
  declarations: [RoleDetailsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RoleUsersModule,
    TabsModule,
    TextareaModule,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
  ],
  exports: [RoleDetailsComponent],
})
export class RoleDetailsModule {}
