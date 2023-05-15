import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectOptionComponent } from './select-option.component';
import { CdkListboxModule } from '@angular/cdk/listbox';

/**
 * UI Select option module
 */
@NgModule({
  declarations: [SelectOptionComponent],
  imports: [CommonModule, CdkListboxModule],
  exports: [SelectOptionComponent],
})
export class SelectOptionModule {}
