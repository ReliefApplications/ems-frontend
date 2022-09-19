import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleAutoAssignmentComponent } from './role-auto-assignment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatTableModule } from '@angular/material/table';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [RoleAutoAssignmentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SafeButtonModule,
    MatTableModule,
    SafeSkeletonTableModule,
    MatTooltipModule,
  ],
  exports: [RoleAutoAssignmentComponent],
})
export class RoleAutoAssignmentModule {}
