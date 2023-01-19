import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import {
  SafeFormModule,
  SafeAccessModule,
  SafeButtonModule,
  SafeEditableTextModule,
} from '@safe/builder';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatProgressSpinnerModule,
    SafeButtonModule,
    TranslateModule,
    SafeEditableTextModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
