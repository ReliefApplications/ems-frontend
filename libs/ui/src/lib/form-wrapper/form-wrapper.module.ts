import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWrapperDirective } from './form-wrapper.directive';
import { PrefixDirective } from './prefix.directive';
import { SuffixDirective } from './suffix.directive';

/**
 * UI Form Wrapper Module
 */
@NgModule({
  declarations: [FormWrapperDirective, PrefixDirective, SuffixDirective],
  imports: [CommonModule],
  exports: [FormWrapperDirective, PrefixDirective, SuffixDirective],
})
export class FormWrapperModule {}
