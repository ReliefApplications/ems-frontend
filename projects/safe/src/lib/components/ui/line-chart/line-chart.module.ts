import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLineChartComponent } from './line-chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

@NgModule({
  declarations: [
    SafeLineChartComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ChartsModule
  ],
  exports: [
    SafeLineChartComponent
  ]
})
export class SafeLineChartModule { }
