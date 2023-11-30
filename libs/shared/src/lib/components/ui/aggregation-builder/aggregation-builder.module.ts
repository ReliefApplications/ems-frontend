import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationBuilderComponent } from './aggregation-builder.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipelineModule } from './pipeline/pipeline.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagboxModule } from '../tagbox/tagbox.module';
import { GridModule } from '../core-grid/grid/grid.module';
import { SpinnerModule, CheckboxModule, ButtonModule } from '@oort-front/ui';
/**
 * Aggregation Builder module.
 * Used by edit-aggregation-modal component.
 */
@NgModule({
  declarations: [AggregationBuilderComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TagboxModule,
    PipelineModule,
    GridModule,
    SpinnerModule,
    CheckboxModule,
    ButtonModule,
  ],
  exports: [AggregationBuilderComponent],
})
export class AggregationBuilderModule {}
