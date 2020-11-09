import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoChartComponent } from './chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [WhoChartComponent],
  imports: [
    CommonModule,
    ChartsModule,
    MatProgressSpinnerModule
  ],
  exports: [WhoChartComponent]
})
export class WhoChartModule { }
