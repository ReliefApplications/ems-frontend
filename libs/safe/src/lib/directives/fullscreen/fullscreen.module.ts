import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenDirective } from './fullscreen.directive';
/**
 *  Fullscreen module.
 */
@NgModule({
  declarations: [FullScreenDirective],
  imports: [CommonModule],
  exports: [FullScreenDirective],
})
export class FullScreenModule {}
