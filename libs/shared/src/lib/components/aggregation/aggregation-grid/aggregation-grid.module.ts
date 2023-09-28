import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationGridComponent } from './aggregation-grid.component';
import { GridModule } from '../../ui/core-grid/grid/grid.module';

/**
 * Shared aggregation Grid component.
 */
@NgModule({
  declarations: [AggregationGridComponent],
  imports: [CommonModule, GridModule],
  exports: [AggregationGridComponent],
})
export class AggregationGridModule {}
