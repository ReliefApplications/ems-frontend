import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRoleAutoAssignmentModalComponent } from './edit-role-auto-assignment-modal.component';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { SafeFilterModule } from '../../../filter/filter.module';

/**
 * Modal interface to edit auto assignment rule of roles.
 */
@NgModule({
  declarations: [EditRoleAutoAssignmentModalComponent],
  imports: [CommonModule, SafeModalModule, SafeFilterModule],
  exports: [EditRoleAutoAssignmentModalComponent],
})
export class EditRoleAutoAssignmentModalModule {}
