import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSeriesSettingsComponent } from './series-settings.component';
import { NgChartsModule } from 'ng2-charts';
import { ColorPickerModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { CategoriesSettingsComponent } from './categories-settings/categories-settings.component';

/**
 * Chart Series Settings module
 */
@NgModule({
  declarations: [SafeSeriesSettingsComponent, CategoriesSettingsComponent],
  imports: [
    CommonModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [SafeSeriesSettingsComponent],
})
export class SeriesSettingsModule {}
