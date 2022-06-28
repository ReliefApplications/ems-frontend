import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeArrayFilterMenuComponent } from './array-filter-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

/**
 * Array filter menu component module.
 */
@NgModule({
  declarations: [SafeArrayFilterMenuComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropDownsModule],
  exports: [SafeArrayFilterMenuComponent],
})
export class SafeArrayFilterMenuModule {}
