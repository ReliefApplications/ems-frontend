import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigurationRoutingModule } from './api-configuration-routing.module';
import { ApiConfigurationComponent } from './api-configuration.component';
import { SafeAccessModule } from '@oort-front/safe';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { SafeButtonModule } from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

/**
 * API configuration page module.
 */
@NgModule({
  declarations: [ApiConfigurationComponent],
  imports: [
    CommonModule,
    ApiConfigurationRoutingModule,
    SafeAccessModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    SafeButtonModule,
    TranslateModule,
    MatChipsModule,
  ],
})
export class ApiConfigurationModule {}
