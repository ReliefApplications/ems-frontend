import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordDropdownComponent } from './record-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

/**
 * SafeRecordDropdownModule is a class used to manage all the modules and components
 * related to the dropdown forms where the user can select records.
 */
@NgModule({
  declarations: [SafeRecordDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [SafeRecordDropdownComponent],
})
export class SafeRecordDropdownModule {}
