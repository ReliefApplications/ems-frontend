import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFullScreenDirective } from './full-screen.directive';

/**
 * Full screen module.
 */
@NgModule({
  declarations: [SafeFullScreenDirective],
  imports: [CommonModule],
  exports: [SafeFullScreenDirective],
})
export class SafeFullScreenModule {}
