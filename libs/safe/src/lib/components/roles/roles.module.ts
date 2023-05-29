import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeRolesComponent } from './roles.component';
import { SafeRoleListModule } from './components/role-list/role-list.module';
import { SafeGroupListModule } from './components/group-list/group-list.module';
import { SafeAddRoleComponent } from './components/add-role/add-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { AbilityModule } from '@casl/angular';
import { ButtonModule } from '@oort-front/ui';
import { DialogModule, FormWrapperModule } from '@oort-front/ui';

/**
 * SafeRolesModule manages modules and components for the roles page
 */
@NgModule({
  declarations: [SafeRolesComponent, SafeAddRoleComponent],
  imports: [
    CommonModule,
    SafeRoleListModule,
    SafeGroupListModule,
    TranslateModule,
    TabsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    DialogModule,
    FormWrapperModule,
    AbilityModule,
    ButtonModule,
  ],
  exports: [SafeRolesComponent],
})
export class SafeRolesModule {}
