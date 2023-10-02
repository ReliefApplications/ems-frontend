import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { FormModule as SharedFormModule } from '@oort-front/shared';
import { ButtonModule } from '@oort-front/ui';

/**
 * Form page module.
 */
@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule, FormRoutingModule, SharedFormModule, ButtonModule],
  exports: [FormComponent],
})
export class FormModule {}
