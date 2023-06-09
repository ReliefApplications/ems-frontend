import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUsersComponent } from './users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@oort-front/ui';
import {
  MenuModule,
  CheckboxModule,
  ButtonModule,
  TableModule,
  SpinnerModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { SafeInviteUsersModule } from './components/invite-users/invite-users.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';

/** Module for components related to users */
@NgModule({
  declarations: [SafeUsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    IconModule,
    FormWrapperModule,
    SpinnerModule,
    CheckboxModule,
    SafeInviteUsersModule,
    TranslateModule,
    SafeSkeletonTableModule,
    ButtonModule,
    TableModule,
    SelectMenuModule,
  ],
  exports: [SafeUsersComponent],
})
export class SafeUsersModule {}
