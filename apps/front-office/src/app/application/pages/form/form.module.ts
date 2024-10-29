import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import {
  ButtonActionModule,
  FormModule as SharedFormModule,
} from '@oort-front/shared';
import { ButtonModule, SpinnerModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Form page module.
 */
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormRoutingModule,
    SharedFormModule,
    ButtonModule,
    TranslateModule,
    SpinnerModule,
    ButtonActionModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
