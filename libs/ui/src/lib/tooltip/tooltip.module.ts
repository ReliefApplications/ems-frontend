import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TooltipDirective,
  TooltipPositionDirective,
} from './tooltip.directive';
import { TooltipComponent } from './tooltip.component';

/**
 * Ui tooltip module
 */
@NgModule({
  declarations: [TooltipDirective, TooltipPositionDirective, TooltipComponent],
  imports: [CommonModule],
  exports: [TooltipDirective, TooltipPositionDirective, TooltipComponent],
})
export class TooltipModule {}
