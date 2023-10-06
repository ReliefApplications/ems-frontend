import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridFilterMenuComponent } from './filter-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

/**
 * Grid filter menu component module.
 */
@NgModule({
  declarations: [SafeGridFilterMenuComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropDownsModule],
  exports: [SafeGridFilterMenuComponent],
})
export class SafeGridFilterMenuModule {}
