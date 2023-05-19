import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TextareaComponent } from './textarea.component';
import { TextareaDirective } from './textarea.directive';
/**
 * UI Textarea module
 */
@NgModule({
  declarations: [TextareaComponent, TextareaDirective],
  imports: [CommonModule, TextFieldModule],
  exports: [TextareaComponent, TextareaDirective],
})
export class TextareaModule {}
