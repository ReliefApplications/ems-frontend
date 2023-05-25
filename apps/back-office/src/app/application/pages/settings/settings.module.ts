import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings-routing.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  TextareaModule,
  FormWrapperModule,
} from '@oort-front/ui';

/**
 * Application settings module.
 */
@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    TranslateModule,
    TextareaModule,
    ButtonModule,
    FormWrapperModule,
  ],
})
export class SettingsModule {}
