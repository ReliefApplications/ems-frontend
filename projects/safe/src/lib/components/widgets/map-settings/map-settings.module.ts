import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapSettingsComponent } from './map-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { SafeBadgeModule } from '../../ui/badge/badge.module';
import { SafeButtonModule } from '../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [SafeMapSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatSliderModule,
    SafeIconModule,
    TextFieldModule,
    SafeQueryBuilderModule,
    SafeBadgeModule,
    SafeButtonModule,
    TranslateModule,
    MatTooltipModule,
    MatTabsModule,
  ],
  exports: [SafeMapSettingsComponent],
})
export class SafeMapSettingsModule {}
