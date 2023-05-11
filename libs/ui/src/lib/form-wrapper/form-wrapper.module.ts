import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWrapperComponent } from './form-wrapper.component';
import { FormWrapperDirective } from './form-wrapper.directive';
import { PrefixDirective } from './prefix.directive';
import { SuffixDirective } from './suffix.directive';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';

/**
 * UI Form Wrapper Module
 */
@NgModule({
  declarations: [
    FormWrapperComponent,
    FormWrapperDirective,
    PrefixDirective,
    SuffixDirective,
  ],
  imports: [CommonModule, IconModule, SpinnerModule],
  exports: [FormWrapperDirective, PrefixDirective, SuffixDirective],
})
export class FormWrapperModule {}
