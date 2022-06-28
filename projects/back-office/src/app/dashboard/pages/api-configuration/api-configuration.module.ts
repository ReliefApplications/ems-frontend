import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigurationRoutingModule } from './api-configuration-routing.module';
import { ApiConfigurationComponent } from './api-configuration.component';
import { SafeAccessModule, SafePreviousButtonModule } from '@safe/builder';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { SafeButtonModule } from '@safe/builder';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ApiConfigurationComponent],
  imports: [
    CommonModule,
    ApiConfigurationRoutingModule,
    SafePreviousButtonModule,
    SafeAccessModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    SafeButtonModule,
    TranslateModule,
  ],
})
export class ApiConfigurationModule {}
