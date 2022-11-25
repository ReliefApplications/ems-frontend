import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePieChartComponent } from './pie-chart.component';
import { NgChartsModule } from 'ng2-charts';

/**
 * Module declaration for safe-pie-chart component
 */
@NgModule({
  declarations: [SafePieChartComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [SafePieChartComponent],
})
export class SafePieChartModule {}
