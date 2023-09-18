import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieDonutChartComponent } from './pie-donut-chart.component';
import { NgChartsModule } from 'ng2-charts';

/**
 * Module declaration for shared-pie-donut-chart component
 */
@NgModule({
  declarations: [PieDonutChartComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [PieDonutChartComponent],
})
export class PieDonutChartModule {}
