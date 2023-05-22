import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeChartComponent } from './chart.component';
import { SpinnerModule } from '@oort-front/ui';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafePieDonutChartModule } from '../../ui/charts/pie-donut-chart/pie-donut-chart.module';
import { SafeLineChartModule } from '../../ui/charts/line-chart/line-chart.module';
import { SafeBarChartModule } from '../../ui/charts/bar-chart/bar-chart.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@oort-front/ui';

/**
 * Module for the chart component
 */
@NgModule({
  declarations: [SafeChartComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    LayoutModule,
    SafeButtonModule,
    SafePieDonutChartModule,
    SafeLineChartModule,
    SafeBarChartModule,
    IconModule,
    TranslateModule,
  ],
  exports: [SafeChartComponent],
})
export class SafeChartModule {}
