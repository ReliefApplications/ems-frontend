import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordDropdownComponent } from './record-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectMenuModule } from '@oort-front/ui';

/**
 * RecordDropdownModule is a class used to manage all the modules and components
 * related to the dropdown forms where the user can select records.
 */
@NgModule({
  declarations: [RecordDropdownComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectMenuModule],
  exports: [RecordDropdownComponent],
})
export class RecordDropdownModule {}
