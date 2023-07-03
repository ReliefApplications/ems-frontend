import { FormsModule } from '@angular/forms';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSkeletonTableModule } from '../../../skeleton/skeleton-table/skeleton-table.module';
import { SafeRoleListComponent } from './role-list.component';
import {
  MenuModule,
  DividerModule,
  ButtonModule,
  TableModule,
  SpinnerModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { AbilityModule } from '@casl/angular';
import { SafeEmptyModule } from '../../../ui/empty/empty.module';

/**
 * BackOfficeRolesModule manages modules and components
 * related to the back-office roles tab
 */
@NgModule({
  declarations: [SafeRoleListComponent],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    SpinnerModule,
    MenuModule,
    IconModule,
    DividerModule,
    TranslateModule,
    SafeSkeletonTableModule,
    AbilityModule,
    ButtonModule,
    TableModule,
    FormWrapperModule,
    SafeEmptyModule,
    SelectMenuModule,
  ],
  exports: [SafeRoleListComponent],
})
export class SafeRoleListModule {}
