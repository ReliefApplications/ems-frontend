import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeChartComponent } from './chart.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafePieDonutChartModule } from '../../ui/pie-donut-chart/pie-donut-chart.module';
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
    SafePieDonutChartModule,
    SafeLineChartModule,
    SafeBarChartModule,
    SafeIconModule,
    TranslateModule,
  ],
  exports: [SafeChartComponent],
})
export class SafeChartModule {}
