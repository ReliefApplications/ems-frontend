import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePieDonutChartComponent } from './pie-donut-chart.component';
import { NgChartsModule } from 'ng2-charts';

/**
 * Module declaration for safe-pie-donut-chart component
 */
@NgModule({
  declarations: [SafePieDonutChartComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [SafePieDonutChartComponent],
})
export class SafePieDonutChartModule {}
