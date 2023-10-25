import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectOptionComponent } from './select-option.component';

/**
 * UI Select option module
 */
@NgModule({
  declarations: [SelectOptionComponent],
  imports: [CommonModule],
  exports: [SelectOptionComponent],
})
export class SelectOptionModule {}
