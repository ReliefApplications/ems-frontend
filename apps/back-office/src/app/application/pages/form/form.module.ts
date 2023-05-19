import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import {
  SafeFormModule,
  SafeAccessModule,
  SafeButtonModule,
  SafeEditableTextModule,
} from '@oort-front/safe';
import { SpinnerModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Application form page module.
 */
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormRoutingModule,
    SafeFormModule,
    SafeAccessModule,
    SpinnerModule,
    SafeButtonModule,
    TranslateModule,
    SafeEditableTextModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
