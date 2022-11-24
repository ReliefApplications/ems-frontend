import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBarChartComponent } from './bar-chart.component';
// import { ChartsModule } from '@progress/kendo-angular-charts';
import { NgChartsModule } from 'ng2-charts';
// import 'hammerjs';

/**
 * Bar chart component module.
 */
@NgModule({
  declarations: [SafeBarChartComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [SafeBarChartComponent],
})
export class SafeBarChartModule {}
