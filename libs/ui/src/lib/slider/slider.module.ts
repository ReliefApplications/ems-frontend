import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';

/**
 * UI Slider Module
 */
@NgModule({
  declarations: [SliderComponent],
  imports: [CommonModule],
  exports: [SliderComponent],
})
export class SliderModule {}
