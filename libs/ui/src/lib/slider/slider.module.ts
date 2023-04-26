import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

/**
 * UI Slider Module
 */
@NgModule({
  declarations: [SliderComponent],
  imports: [CommonModule, BrowserModule, FormsModule],
  exports: [SliderComponent, FormsModule],
})
export class SliderModule {}
