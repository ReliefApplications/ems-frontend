import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayFilterMenuComponent } from './array-filter-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

/**
 * Array filter menu component module.
 */
@NgModule({
  declarations: [ArrayFilterMenuComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropDownsModule],
  exports: [ArrayFilterMenuComponent],
})
export class ArrayFilterMenuModule {}
