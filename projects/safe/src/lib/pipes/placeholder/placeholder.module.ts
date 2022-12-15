import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePlaceholderPipe } from './placeholder.pipe';

/**
 * Pipe to get replace placeholders in a string.
 */
@NgModule({
  declarations: [SafePlaceholderPipe],
  imports: [CommonModule],
  exports: [SafePlaceholderPipe],
  providers: [SafePlaceholderPipe],
})
export class SafePlaceholderModule {}
