import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDonutChartComponent } from './donut-chart.component';
import { NgChartsModule } from 'ng2-charts';

/** Module for the donut chart component */
@NgModule({
  declarations: [SafeDonutChartComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [SafeDonutChartComponent],
})
export class SafeDonutChartModule {}
