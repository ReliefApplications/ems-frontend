import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDonutChartComponent } from './donut-chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';

/** Module for the donut chart component */
@NgModule({
  declarations: [SafeDonutChartComponent],
  imports: [CommonModule, ChartsModule],
  exports: [SafeDonutChartComponent],
})
export class SafeDonutChartModule {}
