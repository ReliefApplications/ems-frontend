import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSeriesMappingComponent } from './series-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipelineModule } from '../pipeline/pipeline.module';
import { SelectMenuModule } from '@oort-front/ui';

/**
 * Series mapping for aggregation builder.
 * Display a list per field used as final stage of aggregation, to get category / field / series fields.
 */
@NgModule({
  declarations: [SafeSeriesMappingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SafePipelineModule,
    SelectMenuModule,
  ],
  exports: [SafeSeriesMappingComponent],
})
export class SafeSeriesMappingModule {}
