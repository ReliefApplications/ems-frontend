import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedWrapperComponent } from './fixed-wrapper.component';

/**
 * UI Fixed Wrapper Module
 */
@NgModule({
  declarations: [FixedWrapperComponent],
  imports: [CommonModule],
  exports: [FixedWrapperComponent],
})
export class FixedWrapperModule {}
