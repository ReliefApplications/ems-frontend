import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigurationRoutingModule } from './api-configuration-routing.module';
import { ApiConfigurationComponent } from './api-configuration.component';
import { SafeAccessModule } from '@oort-front/safe';
import { SpinnerModule } from '@oort-front/ui';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { ButtonModule, SelectMenuModule, SelectOptionModule, FormWrapperModule } from '@oort-front/ui';

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
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    TranslateModule,
    MatChipsModule,
    ButtonModule,
    SelectMenuModule,
    SelectOptionModule,
    FormWrapperModule,
  ],
})
export class ApiConfigurationModule {}
