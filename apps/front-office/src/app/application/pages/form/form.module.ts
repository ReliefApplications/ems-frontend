import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { SafeFormModule } from '@oort-front/safe';
import { ButtonModule } from '@oort-front/ui';

/**
 * Form page module.
 */
@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule, FormRoutingModule, SafeFormModule, ButtonModule],
  exports: [FormComponent],
})
export class FormModule {}
