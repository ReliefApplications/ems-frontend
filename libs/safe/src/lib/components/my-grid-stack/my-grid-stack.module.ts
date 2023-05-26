import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridStackComponent } from './my-grid-stack.component';
/** Module for the widget-related components */
@NgModule({
  declarations: [SafeGridStackComponent],
  imports: [CommonModule],
  exports: [SafeGridStackComponent],
})
export class SafeGridStackModule {}
