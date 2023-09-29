import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { FormModule as SharedFormModule } from '@oort-front/shared';
import { ButtonModule, SpinnerModule } from '@oort-front/ui';

/** Form module. */
@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule, SharedFormModule, ButtonModule, SpinnerModule],
  exports: [FormComponent],
})
export class FormModule {}
