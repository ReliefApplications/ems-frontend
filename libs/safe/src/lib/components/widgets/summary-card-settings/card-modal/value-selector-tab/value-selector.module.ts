import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SafeCoreGridModule } from '../../../../ui/core-grid/core-grid.module';
import { SafeValueSelectorTabComponent } from './value-selector-tab.component';
import { SafeAggregationGridModule } from '../../../../aggregation/aggregation-grid/aggregation-grid.module';

/** Value selector tab module for summary card edition */
@NgModule({
  declarations: [SafeValueSelectorTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SafeCoreGridModule,
    SafeAggregationGridModule,
  ],
  exports: [SafeValueSelectorTabComponent],
})
export class SafeValueSelectorTabModule {}
