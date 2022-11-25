import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeColumnChartComponent } from './column-chart.component';
import { NgChartsModule } from 'ng2-charts';

/**
 * Column chart component module.
 */
@NgModule({
  declarations: [SafeColumnChartComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [SafeColumnChartComponent],
})
export class SafeColumnChartModule {}
