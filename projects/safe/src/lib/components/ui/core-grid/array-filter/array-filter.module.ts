import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeArrayFilterComponent } from './array-filter.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

/**
 * Array filter component module.
 */
@NgModule({
  declarations: [SafeArrayFilterComponent],
  imports: [CommonModule, GridModule, DropDownsModule, ButtonsModule],
  exports: [SafeArrayFilterComponent],
})
export class SafeArrayFilterModule {}
