import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeColumnChartComponent } from './column-chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';

/**
 * Column chart component module.
 */
@NgModule({
  declarations: [SafeColumnChartComponent],
  imports: [CommonModule, ChartsModule],
  exports: [SafeColumnChartComponent],
})
export class SafeColumnChartModule {}
