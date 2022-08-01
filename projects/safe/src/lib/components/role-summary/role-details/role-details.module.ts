import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleDetailsComponent } from './role-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AutoRoleAssignmentComponent } from './auto-role-assignment/auto-role-assignment.component';
import { GeneralRoleDetailsComponent } from './general-role-details/general-role-details.component';

/**
 * General tab of Role Summary.
 * Contain title / description of role + list of users and permissions.
 */
@NgModule({
  declarations: [
    RoleDetailsComponent,
    AutoRoleAssignmentComponent,
    GeneralRoleDetailsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SafeButtonModule,
    MatSelectModule,
  ],
  exports: [RoleDetailsComponent],
})
export class RoleDetailsModule {}
