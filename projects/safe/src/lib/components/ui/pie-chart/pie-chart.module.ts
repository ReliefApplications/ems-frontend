import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePieChartComponent } from './pie-chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

@NgModule({
  declarations: [
    SafePieChartComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ChartsModule
  ],
  exports: [
    SafePieChartComponent
  ]
})
export class SafePieChartModule { }
