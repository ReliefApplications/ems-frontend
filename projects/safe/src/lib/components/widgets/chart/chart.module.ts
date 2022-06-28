import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeChartComponent } from './chart.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeDonutChartModule } from '../../ui/donut-chart/donut-chart.module';
import { SafeColumnChartModule } from '../../ui/column-chart/column-chart.module';
import { SafePieChartModule } from '../../ui/pie-chart/pie-chart.module';
import { SafeLineChartModule } from '../../ui/line-chart/line-chart.module';
import { SafeBarChartModule } from '../../ui/bar-chart/bar-chart.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Module for the chart component
 */
@NgModule({
  declarations: [SafeChartComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    LayoutModule,
    SafeButtonModule,
    SafeDonutChartModule,
    SafePieChartModule,
    SafeLineChartModule,
    SafeColumnChartModule,
    SafeBarChartModule,
    SafeIconModule,
    TranslateModule,
  ],
  exports: [SafeChartComponent],
})
export class SafeChartModule {}
