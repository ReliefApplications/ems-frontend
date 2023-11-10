import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridFilterComponent } from './filter.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

/**
 *  Filter component module.
 */
@NgModule({
  declarations: [SafeGridFilterComponent],
  imports: [CommonModule, GridModule, DropDownsModule, ButtonsModule],
  exports: [SafeGridFilterComponent],
})
export class SafeGridFilterModule {}
