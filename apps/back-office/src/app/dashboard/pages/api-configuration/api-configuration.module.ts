import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigurationRoutingModule } from './api-configuration-routing.module';
import { ApiConfigurationComponent } from './api-configuration.component';
import { AccessModule, StatusOptionsComponent } from '@oort-front/shared';
import { ChipModule, SpinnerModule } from '@oort-front/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  ErrorMessageModule,
  FixedWrapperModule,
} from '@oort-front/ui';

/**
 * API configuration page module.
 */
@NgModule({
  declarations: [ApiConfigurationComponent],
  imports: [
    CommonModule,
    ApiConfigurationRoutingModule,
    AccessModule,
    SpinnerModule,
    FormWrapperModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    ErrorMessageModule,
    ChipModule,
    FixedWrapperModule,
    StatusOptionsComponent,
  ],
})
export class ApiConfigurationModule {}
