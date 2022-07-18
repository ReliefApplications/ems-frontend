import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormActionsComponent } from './form-actions.component';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

/**
 * SafeRecordSummaryModule is the module related to the records information summary.
 */
@NgModule({
  declarations: [SafeFormActionsComponent],
  imports: [CommonModule, DropDownListModule],
  exports: [SafeFormActionsComponent],
})
export class SafeFormActionsModule {}
