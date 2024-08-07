import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { PieDonutChartModule } from '../../ui/charts/pie-donut-chart/pie-donut-chart.module';
import { LineChartModule } from '../../ui/charts/line-chart/line-chart.module';
import { BarChartModule } from '../../ui/charts/bar-chart/bar-chart.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';
import { FormsModule } from '@angular/forms';
import { ExportModule } from '../../ui/charts/export/export.module';

/**
 * Module for the chart component
 */
@NgModule({
  declarations: [ChartComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    PieDonutChartModule,
    LineChartModule,
    BarChartModule,
    IconModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
    SelectMenuModule,
    FormsModule,
    FormWrapperModule,
    ExportModule,
  ],
  exports: [ChartComponent],
})
export class ChartModule {}
