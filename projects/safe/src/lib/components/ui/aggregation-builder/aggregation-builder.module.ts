import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAggregationBuilderComponent } from './aggregation-builder.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFormsDropdownModule } from './forms-dropdown/forms-dropdown.module';
import { SafePipelineModule } from './pipeline/pipeline.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeTagboxModule } from '../tagbox/tagbox.module';
import { SafeSeriesMappingModule } from './series-mapping/series-mapping.module';
import { SafeGridModule } from '../core-grid/grid/grid.module';
import { SafeSpinnerModule } from '../spinner/spinner.module';

/**
 * SafeRecordSummaryModule is the module related to the aggregation builder.
 */
@NgModule({
  declarations: [SafeAggregationBuilderComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SafeFormsDropdownModule,
    SafeTagboxModule,
    SafePipelineModule,
    SafeSeriesMappingModule,
    SafeGridModule,
    SafeSpinnerModule,
  ],
  exports: [SafeAggregationBuilderComponent],
})
export class SafeAggregationBuilderModule {}
