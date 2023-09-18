import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from './line-chart.component';
import { NgChartsModule } from 'ng2-charts';

/**
 * Module declaration for safe-line-chart component
 */
@NgModule({
  declarations: [LineChartComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [LineChartComponent],
})
export class LineChartModule {}
