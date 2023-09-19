import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownFilterMenuComponent } from './dropdown-filter-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

/** Module for the dropdown filter component */
@NgModule({
  declarations: [DropdownFilterMenuComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropDownsModule],
  exports: [DropdownFilterMenuComponent],
})
export class DropdownFilterMenuModule {}
