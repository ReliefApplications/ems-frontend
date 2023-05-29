import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigurationRoutingModule } from './api-configuration-routing.module';
import { ApiConfigurationComponent } from './api-configuration.component';
import { SafeAccessModule } from '@oort-front/safe';
import { ChipModule, SpinnerModule } from '@oort-front/ui';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  SelectMenuModule,
  SelectOptionModule,
  FormWrapperModule,
} from '@oort-front/ui';

/**
 * API configuration page module.
 */
@NgModule({
  declarations: [ApiConfigurationComponent],
  imports: [
    CommonModule,
    ApiConfigurationRoutingModule,
    SafeAccessModule,
    SpinnerModule,
    MatFormFieldModule,
    FormWrapperModule,
    ReactiveFormsModule,
    MatOptionModule,
    TranslateModule,
    ButtonModule,
    SelectMenuModule,
    SelectOptionModule,
    FormWrapperModule,
    ChipModule,
  ],
})
export class ApiConfigurationModule {}
