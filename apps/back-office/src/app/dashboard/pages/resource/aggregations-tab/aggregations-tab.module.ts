import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationsTabRoutingModule } from './aggregations-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { DividerModule, IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeAggregationBuilderModule,
  SafeDateModule,
  SafeSkeletonTableModule,
  SafeEmptyModule,
} from '@oort-front/safe';
import { AggregationsTabComponent } from './aggregations-tab.component';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
} from '@oort-front/ui';

/**
 * Aggregations tab of resource page
 */
@NgModule({
  declarations: [AggregationsTabComponent],
  imports: [
    CommonModule,
    AggregationsTabRoutingModule,
    IconModule,
    MenuModule,
    TranslateModule,
    SafeAggregationBuilderModule,
    OverlayModule,
    SafeDateModule,
    SafeSkeletonTableModule,
    PaginatorModule,
    SafeEmptyModule,
    ButtonModule,
    TableModule,
    DividerModule,
  ],
})
export class AggregationsTabModule {}
