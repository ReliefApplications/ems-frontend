import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationsTabRoutingModule } from './aggregations-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { DividerModule, IconModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  AggregationBuilderModule,
  DateModule,
  SkeletonTableModule,
  EmptyModule,
} from '@oort-front/shared';
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
    AggregationBuilderModule,
    OverlayModule,
    DateModule,
    SkeletonTableModule,
    PaginatorModule,
    EmptyModule,
    ButtonModule,
    TableModule,
    DividerModule,
    TooltipModule,
  ],
})
export class AggregationsTabModule {}
