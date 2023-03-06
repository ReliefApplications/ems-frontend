import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLineChartComponent } from './line-chart.component';
import { NgChartsModule } from 'ng2-charts';

/**
 * Module declaration for safe-line-chart component
 */
@NgModule({
  declarations: [SafeLineChartComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [SafeLineChartComponent],
})
export class SafeLineChartModule {}
