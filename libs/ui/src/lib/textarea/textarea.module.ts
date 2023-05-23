import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TextareaComponent } from './textarea.component';
/**
 * UI Textarea module
 */
@NgModule({
  declarations: [TextareaComponent],
  imports: [CommonModule, TextFieldModule],
  exports: [TextareaComponent],
})
export class TextareaModule {}
