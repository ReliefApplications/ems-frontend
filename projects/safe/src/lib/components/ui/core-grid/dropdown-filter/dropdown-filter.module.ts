import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDropdownFilterComponent } from './dropdown-filter.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

@NgModule({
  declarations: [SafeDropdownFilterComponent],
  imports: [CommonModule, GridModule, DropDownsModule],
  exports: [SafeDropdownFilterComponent],
})
export class SafeDropdownFilterModule {}
