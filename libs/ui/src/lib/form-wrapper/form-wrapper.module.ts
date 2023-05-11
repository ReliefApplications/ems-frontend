import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWrapperComponent } from './form-wrapper.component';
import { FormWrapperDirective } from './form-wrapper.directive';

@NgModule({
  declarations: [FormWrapperComponent, FormWrapperDirective],
  imports: [CommonModule],
  exports: [FormWrapperComponent, FormWrapperDirective],
})
export class FormWrapperModule {}
