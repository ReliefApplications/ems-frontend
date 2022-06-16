import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePieChartComponent } from './pie-chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';

/**
 *
 */
@NgModule({
  declarations: [SafePieChartComponent],
  imports: [CommonModule, ChartsModule],
  exports: [SafePieChartComponent],
})
export class SafePieChartModule {}
