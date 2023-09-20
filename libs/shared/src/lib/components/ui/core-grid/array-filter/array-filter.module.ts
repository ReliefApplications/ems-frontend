import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayFilterComponent } from './array-filter.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

/**
 * Array filter component module.
 */
@NgModule({
  declarations: [ArrayFilterComponent],
  imports: [CommonModule, GridModule, DropDownsModule, ButtonsModule],
  exports: [ArrayFilterComponent],
})
export class ArrayFilterModule {}
