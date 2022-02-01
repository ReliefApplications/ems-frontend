import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAggregationBuilderComponent } from './aggregation-builder.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFormsDropdownModule } from './forms-dropdown/forms-dropdown.module';
import { SafePipelineModule } from './pipeline/pipeline.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeTagboxModule } from '../tagbox/tagbox.module';

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
  ],
  exports: [SafeAggregationBuilderComponent],
})
export class SafeAggregationBuilderModule {}
