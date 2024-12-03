import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ActionButtonsComponent,
  EditableTextModule,
  FormModule as SharedFormModule,
} from '@oort-front/shared';
import {
  ButtonModule,
  IconModule,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';

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
    ActionButtonsComponent,
    IconModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
