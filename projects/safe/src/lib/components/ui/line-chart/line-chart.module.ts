import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLineChartComponent } from './line-chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';

/**
 * Module declaration for safe-line-chart component
 */
@NgModule({
  declarations: [SafeLineChartComponent],
  imports: [CommonModule, ChartsModule],
  exports: [SafeLineChartComponent],
})
export class SafeLineChartModule {}
