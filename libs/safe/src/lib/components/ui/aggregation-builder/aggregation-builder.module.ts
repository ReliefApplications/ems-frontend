import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAggregationBuilderComponent } from './aggregation-builder.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipelineModule } from './pipeline/pipeline.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeTagboxModule } from '../tagbox/tagbox.module';
import { SafeGridModule } from '../core-grid/grid/grid.module';
import { SpinnerModule } from '@oort-front/ui';

/**
 * Aggregation Builder module.
 * Used by edit-aggregation-modal component.
 */
@NgModule({
  declarations: [SafeAggregationBuilderComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SafeTagboxModule,
    SafePipelineModule,
    SafeGridModule,
    SpinnerModule,
  ],
  exports: [SafeAggregationBuilderComponent],
})
export class SafeAggregationBuilderModule {}
