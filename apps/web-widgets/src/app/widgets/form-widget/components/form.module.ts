import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { SafeFormModule } from '@oort-front/safe';
import { ButtonModule, SpinnerModule } from '@oort-front/ui';

/** Form module. */
@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule, SafeFormModule, ButtonModule, SpinnerModule],
  exports: [FormComponent],
})
export class FormModule {}
