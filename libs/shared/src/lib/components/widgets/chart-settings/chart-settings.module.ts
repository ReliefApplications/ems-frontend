import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ExpansionPanelModule,
  IconModule,
  SelectMenuModule,
  TabsModule,
  TooltipModule,
} from '@oort-front/ui';
import { GridModule } from '../../../components/ui/core-grid/grid/grid.module';
import { PaletteControlModule } from '../../palette-control/palette-control.module';
import { QueryBuilderModule } from '../../query-builder/query-builder.module';
import { AggregationBuilderModule } from '../../ui/aggregation-builder/aggregation-builder.module';
import { ChartModule } from '../chart/chart.module';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { ChartSettingsComponent } from './chart-settings.component';
import { TabDisplayModule } from './tab-display/tab-display.module';
import { TabMainModule } from './tab-main/tab-main.module';
import { ContextualFiltersSettingsComponent } from '../common/contextual-filters-settings/contextual-filters-settings.component';

/** Module for the chart settings component */
@NgModule({
  declarations: [ChartSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    TabMainModule,
    TabDisplayModule,
    TooltipModule,
    SelectMenuModule,
    DisplaySettingsComponent,
    ContextualFiltersSettingsComponent,
  ],
  exports: [ChartSettingsComponent],
})
export class ChartSettingsModule {}
