import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { SafeButtonModule, SafeFormModule } from '@oort-front/safe';
import { SpinnerModule } from '@oort-front/ui';

/** Form module. */
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    SafeFormModule,
    SpinnerModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
