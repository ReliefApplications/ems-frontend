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
import { AccessModule, StatusOptionsComponent } from '@oort-front/shared';
import { AbilityModule } from '@casl/angular';

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
    AccessModule,
    StatusOptionsComponent,
    AbilityModule,
  ],
})
export class SettingsModule {}
