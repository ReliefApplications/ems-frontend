import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDisplayPipe } from './icon-display.pipe';

/**
 *  Icon Display module.
 * Include pipe to set the correct prefix class for the icon family given in order to display it in the template
 */
@NgModule({
  declarations: [IconDisplayPipe],
  imports: [CommonModule],
  exports: [IconDisplayPipe],
})
export class IconDisplayModule {}
