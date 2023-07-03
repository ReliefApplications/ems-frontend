import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabDisplayComponent } from './tab-display.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafePaletteControlModule } from '../../../palette-control/palette-control.module';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { SafeAggregationBuilderModule } from '../../../ui/aggregation-builder/aggregation-builder.module';
import { SafeGridModule } from '../../../ui/core-grid/grid/grid.module';
import { SafeChartModule } from '../../chart/chart.module';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SeriesSettingsModule } from '../series-settings/series-settings.module';
import {
  ButtonModule,
  ToggleModule,
  TooltipModule,
  DividerModule,
  ExpansionPanelModule,
  TabsModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';

/**
 * Display tab of chart settings modal.
 */
@NgModule({
  declarations: [TabDisplayComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    IconModule,
    TextFieldModule,
    SafeQueryBuilderModule,
    SafeChartModule,
    ExpansionPanelModule,
    ToggleModule,
    TabsModule,
    TranslateModule,
    SafeAggregationBuilderModule,
    SafeGridModule,
    SafePaletteControlModule,
    InputsModule,
    SeriesSettingsModule,
    TooltipModule,
    DividerModule,
    ButtonModule,
    SelectMenuModule,
  ],
  exports: [TabDisplayComponent],
})
export class TabDisplayModule {}
