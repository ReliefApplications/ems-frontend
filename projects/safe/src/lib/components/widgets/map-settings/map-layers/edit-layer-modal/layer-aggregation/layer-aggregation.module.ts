import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayerAggregationComponent } from './layer-aggregation.component';
import { SafeButtonModule } from 'projects/safe/src/lib/components/ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';

/** Module for the Layer Aggregation Component */
@NgModule({
  declarations: [SafeLayerAggregationComponent],
  imports: [CommonModule, TranslateModule, SafeButtonModule],
  exports: [SafeLayerAggregationComponent],
})
export class SafeLayerAggregationModule {}
