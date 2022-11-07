import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAggregationGridComponent } from './aggregation-grid.component';
import { GridModule } from '@progress/kendo-angular-grid';

/**
 * Shared aggregation Grid component.
 */
@NgModule({
  declarations: [SafeAggregationGridComponent],
  imports: [CommonModule, GridModule],
  exports: [SafeAggregationGridComponent],
})
export class SafeAggregationGridModule {}
