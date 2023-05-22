import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationsTabRoutingModule } from './aggregations-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeButtonModule,
  SafeAggregationBuilderModule,
  SafeDateModule,
  SafeSkeletonTableModule,
  SafeEmptyModule,
} from '@oort-front/safe';
import { AggregationsTabComponent } from './aggregations-tab.component';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { IconModule } from '@oort-front/ui';

/**
 * Aggregations tab of resource page
 */
@NgModule({
  declarations: [AggregationsTabComponent],
  imports: [
    CommonModule,
    AggregationsTabRoutingModule,
    MatTableModule,
    MatMenuModule,
    SafeButtonModule,
    TranslateModule,
    SafeAggregationBuilderModule,
    OverlayModule,
    SafeDateModule,
    SafeSkeletonTableModule,
    MatPaginatorModule,
    SafeEmptyModule,
    IconModule,
  ],
})
export class AggregationsTabModule {}
