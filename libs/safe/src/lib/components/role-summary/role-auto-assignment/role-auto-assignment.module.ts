import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleAutoAssignmentComponent } from './role-auto-assignment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { TooltipModule, TableModule } from '@oort-front/ui';

/**
 * Component for Auto assignment of role
 */
@NgModule({
  declarations: [RoleAutoAssignmentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    TooltipModule,
    TableModule,
  ],
  exports: [RoleAutoAssignmentComponent],
})
export class RoleAutoAssignmentModule {}
