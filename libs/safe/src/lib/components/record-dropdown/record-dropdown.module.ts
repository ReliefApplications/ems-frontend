import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordDropdownComponent } from './record-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectMenuModule } from '@oort-front/ui';

/**
 * SafeRecordDropdownModule is a class used to manage all the modules and components
 * related to the dropdown forms where the user can select records.
 */
@NgModule({
  declarations: [SafeRecordDropdownComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectMenuModule],
  exports: [SafeRecordDropdownComponent],
})
export class SafeRecordDropdownModule {}
