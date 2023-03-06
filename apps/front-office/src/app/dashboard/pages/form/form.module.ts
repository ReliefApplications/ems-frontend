import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { SafeFormModule, SafeButtonModule } from '@oort-front/safe';

/**
 * Form page module.
 */
@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule, FormRoutingModule, SafeFormModule, SafeButtonModule],
  exports: [FormComponent],
})
export class FormModule {}
