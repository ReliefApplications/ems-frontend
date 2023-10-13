import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart.component';
import { NgChartsModule } from 'ng2-charts';

/**
 * Bar chart component module.
 */
@NgModule({
  declarations: [BarChartComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [BarChartComponent],
})
export class BarChartModule {}
