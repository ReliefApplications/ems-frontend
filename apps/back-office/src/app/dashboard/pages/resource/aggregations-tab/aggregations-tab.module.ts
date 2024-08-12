import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationsTabRoutingModule } from './aggregations-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { AggregationBuilderModule } from '@oort-front/shared';
import { AggregationsTabComponent } from './aggregations-tab.component';
import { DataPresentationListComponent } from '../components/data-presentation-list/data-presentation-list.component';

/**
 * Aggregations tab of resource page
 */
@NgModule({
  declarations: [AggregationsTabComponent],
  imports: [
    CommonModule,
    AggregationsTabRoutingModule,
    AggregationBuilderModule,
    OverlayModule,
    DataPresentationListComponent,
  ],
})
export class AggregationsTabModule {}
