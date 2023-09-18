import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
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
import { InviteUsersModule } from './components/invite-users/invite-users.module';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';

/** Module for components related to users */
@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    IconModule,
    FormWrapperModule,
    SpinnerModule,
    CheckboxModule,
    InviteUsersModule,
    TranslateModule,
    SkeletonTableModule,
    ButtonModule,
    TableModule,
    SelectMenuModule,
  ],
  exports: [UsersComponent],
})
export class UsersModule {}
