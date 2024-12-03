import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ActionButtonsComponent,
  FormModule as SharedFormModule,
} from '@oort-front/shared';
import { ButtonModule, SpinnerModule } from '@oort-front/ui';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';

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
    ActionButtonsComponent,
  ],
  exports: [FormComponent],
})
export class FormModule {}
