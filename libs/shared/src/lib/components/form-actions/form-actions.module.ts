import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormActionsComponent } from './form-actions.component';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

/**
 * Module for the safeFormActions component
 */
@NgModule({
  declarations: [FormActionsComponent],
  imports: [CommonModule, DropDownListModule],
  exports: [FormActionsComponent],
})
export class FormActionsModule {}
