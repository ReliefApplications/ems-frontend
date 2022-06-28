import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBarChartComponent } from './bar-chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';

/**
 * Bar chart component module.
 */
@NgModule({
  declarations: [SafeBarChartComponent],
  imports: [CommonModule, ChartsModule],
  exports: [SafeBarChartComponent],
})
export class SafeBarChartModule {}
