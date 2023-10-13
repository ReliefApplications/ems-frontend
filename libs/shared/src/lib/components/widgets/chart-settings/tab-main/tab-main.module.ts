import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormWrapperModule, SelectMenuModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { AggregationBuilderModule } from '../../../ui/aggregation-builder/aggregation-builder.module';
import { SeriesMappingModule } from '../../../ui/aggregation-builder/series-mapping/series-mapping.module';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { AggregationOriginSelectComponent } from '../../../aggregation/aggregation-origin-select/aggregation-origin-select.component';

/**
 * Main tab of chart settings modal.
 */
@NgModule({
  declarations: [TabMainComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TranslateModule,
    AggregationBuilderModule,
    SeriesMappingModule,
    ButtonModule,
    SelectMenuModule,
    TooltipModule,
    AggregationOriginSelectComponent,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
