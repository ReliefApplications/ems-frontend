import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ExpansionPanelModule,
  GraphQLSelectModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { IconModule } from '@oort-front/ui';
import { TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { PaletteControlModule } from '../../../palette-control/palette-control.module';
import { QueryBuilderModule } from '../../../query-builder/query-builder.module';
import { AggregationBuilderModule } from '../../../ui/aggregation-builder/aggregation-builder.module';
import { GridModule } from '../../../ui/core-grid/grid/grid.module';
import { ChartModule } from '../../chart/chart.module';
import { SeriesMappingModule } from '../../../ui/aggregation-builder/series-mapping/series-mapping.module';
import { ButtonModule, FormWrapperModule } from '@oort-front/ui';

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
    IconModule,
    TextFieldModule,
    QueryBuilderModule,
    ChartModule,
    TabsModule,
    ExpansionPanelModule,
    TranslateModule,
    AggregationBuilderModule,
    GridModule,
    PaletteControlModule,
    GraphQLSelectModule,
    SeriesMappingModule,
    ButtonModule,
    SelectMenuModule,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
