import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDatePipe } from './date.pipe';

/**
 * Safe Date module.
 * Include pipe to format date depending on user parameters.
 */
@NgModule({
  declarations: [SafeDatePipe],
  imports: [CommonModule],
  exports: [SafeDatePipe],
})
export class SafeDateModule {}
