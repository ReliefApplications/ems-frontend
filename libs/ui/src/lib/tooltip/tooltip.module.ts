import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { TooltipComponent } from './tooltip.component';

/**
 * Ui tooltip module
 */
@NgModule({
  declarations: [TooltipDirective, TooltipComponent],
  imports: [CommonModule],
  exports: [TooltipDirective, TooltipComponent],
})
export class TooltipModule {}
