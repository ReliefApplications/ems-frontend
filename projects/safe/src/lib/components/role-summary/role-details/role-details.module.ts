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
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeAddRoleRuleComponent } from './auto-role-assignment/add-role-rule/add-role-rule.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { MatButtonModule } from '@angular/material/button';

/**
 * General tab of Role Summary.
 * Contain title / description of role + list of users and permissions.
 */
@NgModule({
  declarations: [
    RoleDetailsComponent,
    AutoRoleAssignmentComponent,
    GeneralRoleDetailsComponent,
    SafeAddRoleRuleComponent,
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
    SafeSkeletonTableModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    SafeQueryBuilderModule,
    MatButtonModule,
  ],
  exports: [RoleDetailsComponent],
})
export class RoleDetailsModule {}
