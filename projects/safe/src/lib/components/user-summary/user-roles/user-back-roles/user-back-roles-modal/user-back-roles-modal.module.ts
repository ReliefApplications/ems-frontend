import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SafeModalModule } from '../../../../ui/modal/modal.module';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { SafeUserBackRolesModalComponent } from './user-back-roles-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * SafeUserBackRolesModalModul is a class used to manage all the modules and components
 * related to the general confirmation modals.
 */
@NgModule({
  declarations: [SafeUserBackRolesModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    SafeModalModule,
    SafeButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [SafeUserBackRolesModalComponent],
})
export class SafeUserBackRolesModalModule {}
