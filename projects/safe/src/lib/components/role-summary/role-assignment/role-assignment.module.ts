import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeAddRoleRuleComponent } from './add-role-rule/add-role-rule.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleAssignmentComponent } from './role-assignment.component';

@NgModule({
  declarations: [RoleAssignmentComponent, SafeAddRoleRuleComponent],
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
    MatProgressSpinnerModule,
  ],
  exports: [RoleAssignmentComponent],
})
export class RoleAssignmentModule {}
