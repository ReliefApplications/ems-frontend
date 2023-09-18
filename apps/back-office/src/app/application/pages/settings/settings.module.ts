import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  SelectMenuModule,
  TextareaModule,
  FormWrapperModule,
  ToggleModule,
  FixedWrapperModule,
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
    ReactiveFormsModule,
    TranslateModule,
    TextareaModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    ToggleModule,
    FixedWrapperModule,
  ],
})
export class SettingsModule {}
