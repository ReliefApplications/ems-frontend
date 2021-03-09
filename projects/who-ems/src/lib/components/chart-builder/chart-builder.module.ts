import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoChartBuilderComponent } from './chart-builder.component';
import { WhoTabChartDataComponent } from './tab-chart-data/tab-chart-data.component';
import { WhoTabChartFilterComponent } from './tab-chart-filter/tab-chart-filter.component';
import { WhoTabChartOptionsComponent } from './tab-chart-options/tab-chart-options.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [WhoChartBuilderComponent, WhoTabChartDataComponent, WhoTabChartFilterComponent, WhoTabChartOptionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule
  ],
  exports: [WhoChartBuilderComponent]
})
export class WhoChartBuilderModule { }
