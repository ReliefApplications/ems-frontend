import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSeriesSettingsComponent } from './series-settings.component';
import { NgChartsModule } from 'ng2-charts';
import { ColorPickerModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';
import { CategoriesSettingsModule } from './categories-settings/categories-settings.module';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { CategoriesSettingsModule } from './categories-settings/categories-settings.module';
import { SelectMenuModule, ToggleModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Chart Series Settings module
 */
@NgModule({
  declarations: [SafeSeriesSettingsComponent],
  imports: [
    CommonModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    CategoriesSettingsModule,
    MatSlideToggleModule,
    CategoriesSettingsModule,
    ToggleModule,
    TranslateModule,
    SelectMenuModule,
  ],
  exports: [SafeSeriesSettingsComponent],
})
export class SeriesSettingsModule {}
