import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAggregationGridComponent } from './aggregation-grid.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule } from '@progress/kendo-angular-buttons';

/**
 * Shared aggregation Grid component.
 */
@NgModule({
  declarations: [SafeAggregationGridComponent],
  imports: [
    CommonModule,
    GridModule,
    TranslateModule,
    MatTooltipModule,
    ButtonModule,
  ],
  exports: [SafeAggregationGridComponent],
})
export class SafeAggregationGridModule {}
