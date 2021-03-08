import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoChartBuilderComponent } from './chart-builder.component';

@NgModule({
  declarations: [WhoChartBuilderComponent],
  imports: [
    CommonModule
  ],
  exports: [WhoChartBuilderComponent]
})
export class WhoChartBuilderModule { }
