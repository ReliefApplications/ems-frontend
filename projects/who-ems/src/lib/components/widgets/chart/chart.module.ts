import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoChartComponent } from './chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [WhoChartComponent],
  imports: [
    CommonModule,
    ChartsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  exports: [WhoChartComponent]
})
export class WhoChartModule { }
