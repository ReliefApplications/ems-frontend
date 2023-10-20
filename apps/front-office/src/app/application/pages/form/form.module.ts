import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { FormModule as SharedFormModule } from '@oort-front/shared';
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
  ],
  exports: [FormComponent],
})
export class FormModule {}
