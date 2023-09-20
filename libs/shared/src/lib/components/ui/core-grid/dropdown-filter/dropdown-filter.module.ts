import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownFilterComponent } from './dropdown-filter.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

/**
 * Dropdown filter component module.
 */
@NgModule({
  declarations: [DropdownFilterComponent],
  imports: [
    CommonModule,
    GridModule,
    DropDownsModule,
    ButtonModule,
    ButtonsModule,
  ],
  exports: [DropdownFilterComponent],
})
export class DropdownFilterModule {}
