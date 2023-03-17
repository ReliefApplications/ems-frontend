import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenDirective } from './fullscreen.directive';
import {
  OverlayContainer,
  FullscreenOverlayContainer,
} from '@angular/cdk/overlay';

/**
 *  Fullscreen module.
 */
@NgModule({
  declarations: [FullScreenDirective],
  imports: [CommonModule],
  providers: [
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
  ],
  exports: [FullScreenDirective],
})
export class FullScreenModule {}
