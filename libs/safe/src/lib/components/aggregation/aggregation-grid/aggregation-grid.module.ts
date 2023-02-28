import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAggregationGridComponent } from './aggregation-grid.component';
import { SafeGridModule } from '../../ui/core-grid/grid/grid.module';

/**
 * Shared aggregation Grid component.
 */
@NgModule({
  declarations: [SafeAggregationGridComponent],
  imports: [CommonModule, SafeGridModule],
  exports: [SafeAggregationGridComponent],
})
export class SafeAggregationGridModule {}
