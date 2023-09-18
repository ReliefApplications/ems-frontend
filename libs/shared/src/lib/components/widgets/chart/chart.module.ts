import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { PieDonutChartModule } from '../../ui/charts/pie-donut-chart/pie-donut-chart.module';
import { LineChartModule } from '../../ui/charts/line-chart/line-chart.module';
import { BarChartModule } from '../../ui/charts/bar-chart/bar-chart.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, IconModule, SpinnerModule } from '@oort-front/ui';

/**
 * Module for the chart component
 */
@NgModule({
  declarations: [ChartComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    LayoutModule,
    PieDonutChartModule,
    LineChartModule,
    BarChartModule,
    IconModule,
    TranslateModule,
    ButtonModule,
  ],
  exports: [ChartComponent],
})
export class ChartModule {}
