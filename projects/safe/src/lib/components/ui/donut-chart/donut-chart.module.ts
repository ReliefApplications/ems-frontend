import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDonutChartComponent } from './donut-chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';

@NgModule({
  declarations: [SafeDonutChartComponent],
  imports: [CommonModule, ChartsModule],
  exports: [SafeDonutChartComponent],
})
export class SafeDonutChartModule {}
