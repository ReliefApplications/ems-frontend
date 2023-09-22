import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { RolesComponent } from './roles.component';
import { RoleListModule } from './components/role-list/role-list.module';
import { GroupListModule } from './components/group-list/group-list.module';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbilityModule } from '@casl/angular';
import { ButtonModule } from '@oort-front/ui';
import { DialogModule, FormWrapperModule } from '@oort-front/ui';

/**
 * RolesModule manages modules and components for the roles page
 */
@NgModule({
  declarations: [RolesComponent, AddRoleComponent],
  imports: [
    CommonModule,
    RoleListModule,
    GroupListModule,
    TranslateModule,
    TabsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    FormWrapperModule,
    AbilityModule,
    ButtonModule,
  ],
  exports: [RolesComponent],
})
export class RolesModule {}
