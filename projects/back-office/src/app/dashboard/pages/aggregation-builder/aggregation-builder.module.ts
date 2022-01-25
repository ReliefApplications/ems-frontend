import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationBuilderComponent } from './aggregation-builder.component';
import { SafeAggregationBuilderModule } from '@safe/builder';
import { AggregationBuilderRoutingModule } from './aggregation-builder-routing.module';

@NgModule({
  declarations: [AggregationBuilderComponent],
  imports: [
    CommonModule,
    AggregationBuilderRoutingModule,
    SafeAggregationBuilderModule,
  ],
})
export class AggregationBuilderModule {}
