import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';
import { TooltipModule } from '../tooltip/tooltip.module';

/**
 * UI Icon Module
 */
@NgModule({
  declarations: [IconComponent],
  imports: [CommonModule, TooltipModule],
  exports: [IconComponent],
})
export class IconModule {}
