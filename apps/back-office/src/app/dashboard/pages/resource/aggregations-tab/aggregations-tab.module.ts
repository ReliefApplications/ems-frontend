import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationsTabRoutingModule } from './aggregations-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeAggregationBuilderModule,
  SafeDateModule,
  SafeSkeletonTableModule,
  SafeEmptyModule,
} from '@oort-front/safe';
import { AggregationsTabComponent } from './aggregations-tab.component';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MenuModule, ButtonModule } from '@oort-front/ui';

/**
 * Aggregations tab of resource page
 */
@NgModule({
  declarations: [AggregationsTabComponent],
  imports: [
    CommonModule,
    AggregationsTabRoutingModule,
    MatTableModule,
    MatIconModule,
    MenuModule,
    TranslateModule,
    SafeAggregationBuilderModule,
    OverlayModule,
    SafeDateModule,
    SafeSkeletonTableModule,
    MatPaginatorModule,
    SafeEmptyModule,
    ButtonModule,
  ],
})
export class AggregationsTabModule {}
