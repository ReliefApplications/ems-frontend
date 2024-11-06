import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonActionModule,
  FormModule as SharedFormModule,
} from '@oort-front/shared';
import { ButtonModule } from '@oort-front/ui';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';

/**
 * Application preview form page module.
 */
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormRoutingModule,
    SharedFormModule,
    TranslateModule,
    ButtonModule,
    ButtonActionModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
