import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridFilterComponent } from './filter.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

/**
 *  Filter component module.
 */
@NgModule({
  declarations: [GridFilterComponent],
  imports: [CommonModule, GridModule, DropDownsModule, ButtonsModule],
  exports: [GridFilterComponent],
})
export class GridFilterModule {}
