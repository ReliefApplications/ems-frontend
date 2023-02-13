import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { SafeRolesComponent } from './roles.component';
import { SafeRoleListModule } from './components/role-list/role-list.module';
import { SafeGroupListModule } from './components/group-list/group-list.module';
import { SafeAddRoleComponent } from './components/add-role/add-role.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SafeModalModule } from '../ui/modal/modal.module';
import { AbilityModule } from '@casl/angular';

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
    MatTabsModule,
    MatDialogModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    SafeModalModule,
    AbilityModule,
  ],
  exports: [SafeRolesComponent],
})
export class SafeRolesModule {}
