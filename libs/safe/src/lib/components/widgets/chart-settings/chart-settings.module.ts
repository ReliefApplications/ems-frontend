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
import { SafeGridModule } from '../../../components/ui/core-grid/grid/grid.module';
import { SafePaletteControlModule } from '../../palette-control/palette-control.module';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { SafeAggregationBuilderModule } from '../../ui/aggregation-builder/aggregation-builder.module';
import { SafeChartModule } from '../chart/chart.module';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { SafeChartSettingsComponent } from './chart-settings.component';
import { TabDisplayModule } from './tab-display/tab-display.module';
import { TabMainModule } from './tab-main/tab-main.module';
import { ContextualFiltersSettingsComponent } from '../common/contextual-filters-settings/contextual-filters-settings.component';

/** Module for the chart settings component */
@NgModule({
  declarations: [SafeChartSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    TextFieldModule,
    SafeQueryBuilderModule,
    SafeChartModule,
    TabsModule,
    ExpansionPanelModule,
    TranslateModule,
    SafeAggregationBuilderModule,
    SafeGridModule,
    SafePaletteControlModule,
    TabMainModule,
    TabDisplayModule,
    TooltipModule,
    SelectMenuModule,
    DisplaySettingsComponent,
    ContextualFiltersSettingsComponent,
  ],
  exports: [SafeChartSettingsComponent],
})
export class SafeChartSettingsModule {}
