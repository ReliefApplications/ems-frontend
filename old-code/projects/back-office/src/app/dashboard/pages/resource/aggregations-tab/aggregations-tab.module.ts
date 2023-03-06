import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationsTabRoutingModule } from './aggregations-tab-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeButtonModule,
  SafeAggregationBuilderModule,
  SafeDateModule,
  SafeSkeletonTableModule,
  SafeEmptyModule,
} from '@safe/builder';
import { AggregationsTabComponent } from './aggregations-tab.component';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';

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
    MatMenuModule,
    SafeButtonModule,
    MatTooltipModule,
    TranslateModule,
    SafeAggregationBuilderModule,
    OverlayModule,
    SafeDateModule,
    SafeSkeletonTableModule,
    MatPaginatorModule,
    SafeEmptyModule,
  ],
})
export class AggregationsTabModule {}
