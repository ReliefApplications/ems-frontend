import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { SafeRolesComponent } from './roles.component';
import { SafeBackOfficeRolesModule } from './back-office-roles/back-office-roles.module';
import { SafeGroupsModule } from './groups/groups.module';
import { SafeAddRoleComponent } from './components/add-role/add-role.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

/**
 * SafeRolesModule manages modules and components for the roles page
 */
@NgModule({
  declarations: [SafeRolesComponent, SafeAddRoleComponent],
  imports: [
    CommonModule,
    SafeBackOfficeRolesModule,
    SafeGroupsModule,
    TranslateModule,
    MatTabsModule,
    MatDialogModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  exports: [SafeRolesComponent],
})
export class SafeRolesModule {}
