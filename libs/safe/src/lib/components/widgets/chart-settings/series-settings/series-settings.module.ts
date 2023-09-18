import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSeriesSettingsComponent } from './series-settings.component';
import { NgChartsModule } from 'ng2-charts';
import { ColorPickerModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesSettingsModule } from './categories-settings/categories-settings.module';
import {
  FormWrapperModule,
  SelectMenuModule,
  ToggleModule,
} from '@oort-front/ui';
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
    FormWrapperModule,
    TranslateModule,
    CategoriesSettingsModule,
    CategoriesSettingsModule,
    ToggleModule,
    TranslateModule,
    SelectMenuModule,
  ],
  exports: [SafeSeriesSettingsComponent],
})
export class SeriesSettingsModule {}
