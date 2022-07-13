import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvancedSettingsRoutingModule } from './advanced-settings-routing.module';
import { AdvancedSettingsComponent } from './advanced-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeButtonModule,
  SafeIconModule,
  SafeMappingModule,
  SafePreviousButtonModule,
} from '@safe/builder';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [AdvancedSettingsComponent],
  imports: [
    CommonModule,
    AdvancedSettingsRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SafePreviousButtonModule,
    SafeButtonModule,
    SafeMappingModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    SafeIconModule,
  ],
})
export class AdvancedSettingsModule {}
