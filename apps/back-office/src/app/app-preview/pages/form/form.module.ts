import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import {
  ActionButtonsComponent,
  FormModule as SharedFormModule,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';

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
    ActionButtonsComponent,
  ],
  exports: [FormComponent],
})
export class FormModule {}
