import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import {
  FormModule as SharedFormModule,
  EditableTextModule,
} from '@oort-front/shared';
import { ButtonModule, SpinnerModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Application form page module.
 */
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormRoutingModule,
    SharedFormModule,
    SpinnerModule,
    TranslateModule,
    EditableTextModule,
    ButtonModule,
    TooltipModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
