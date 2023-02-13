import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSeriesMappingComponent } from './series-mapping.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipelineModule } from '../pipeline/pipeline.module';

/**
 * Series mapping for aggregation builder.
 * Display a list per field used as final stage of aggregation, to get category / field / series fields.
 */
@NgModule({
  declarations: [SafeSeriesMappingComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SafePipelineModule,
  ],
  exports: [SafeSeriesMappingComponent],
})
export class SafeSeriesMappingModule {}
