import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeChartComponent } from './chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {SafeButtonModule} from '../../ui/button/button.module';

@NgModule({
  declarations: [SafeChartComponent],
    imports: [
        CommonModule,
        ChartsModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        SafeButtonModule
    ],
  exports: [SafeChartComponent]
})
export class SafeChartModule { }
