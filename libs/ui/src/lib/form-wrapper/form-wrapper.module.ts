import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWrapperDirective } from './form-wrapper.directive';
import { PrefixDirective } from './prefix.directive';
import { SuffixDirective } from './suffix.directive';
import { FormControlComponent } from './form-control/form-control.component';

/**
 * UI Form Wrapper Module
 */
@NgModule({
  declarations: [
    FormWrapperDirective,
    PrefixDirective,
    SuffixDirective,
    FormControlComponent,
  ],
  imports: [CommonModule],
  exports: [
    FormWrapperDirective,
    PrefixDirective,
    SuffixDirective,
    FormControlComponent,
  ],
})
export class FormWrapperModule {}
