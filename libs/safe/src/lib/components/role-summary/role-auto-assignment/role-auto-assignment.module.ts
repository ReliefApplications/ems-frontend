import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleAutoAssignmentComponent } from './role-auto-assignment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { TooltipModule, ButtonModule, TableModule } from '@oort-front/ui';
import { SafeEmptyModule } from '../../ui/empty/empty.module';

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
    SafeSkeletonTableModule,
    TooltipModule,
    ButtonModule,
    SafeEmptyModule,
    TableModule,
  ],
  exports: [RoleAutoAssignmentComponent],
})
export class RoleAutoAssignmentModule {}
