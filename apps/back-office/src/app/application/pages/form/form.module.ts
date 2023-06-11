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
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '@oort-front/safe';

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
    SafeIconModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
