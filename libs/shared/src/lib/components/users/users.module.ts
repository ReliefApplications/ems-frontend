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
  TooltipModule,
} from '@oort-front/ui';
import { InviteUsersModule } from './components/invite-users/invite-users.module';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { ListFilterComponent } from '../list-filter/list-filter.component';
import { FilterComponent } from './filter/filter.component';

/** Module for components related to users */
@NgModule({
  declarations: [UsersComponent, FilterComponent],
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
    TooltipModule,
    ListFilterComponent,
  ],
  exports: [UsersComponent],
})
export class UsersModule {}
