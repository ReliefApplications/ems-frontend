import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDropdownFilterMenuComponent } from './dropdown-filter-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

/** Module for the dropdown filter component */
@NgModule({
  declarations: [SafeDropdownFilterMenuComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropDownsModule],
  exports: [SafeDropdownFilterMenuComponent],
})
export class SafeDropdownFilterMenuModule {}
