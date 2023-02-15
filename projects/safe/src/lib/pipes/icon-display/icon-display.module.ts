import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeIconDisplayPipe } from './icon-display.pipe';

/**
 * Safe Icon Display module.
 * Include pipe to set the correct prefix class for the icon family given in order to display it in the template
 */
@NgModule({
  declarations: [SafeIconDisplayPipe],
  imports: [CommonModule],
  exports: [SafeIconDisplayPipe],
})
export class SafeIconDisplayModule {}
