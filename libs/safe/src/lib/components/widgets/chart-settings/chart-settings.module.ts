import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeChartSettingsComponent } from './chart-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { SafeChartModule } from '../chart/chart.module';
import {
  ExpansionPanelModule,
  SelectMenuModule,
  SelectOptionModule,
  TabsModule,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeAggregationBuilderModule } from '../../ui/aggregation-builder/aggregation-builder.module';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { SafeGridModule } from '../../../components/ui/core-grid/grid/grid.module';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { SafePaletteControlModule } from '../../palette-control/palette-control.module';
import { TabMainModule } from './tab-main/tab-main.module';
import { TabDisplayModule } from './tab-display/tab-display.module';

/** Module for the chart settings component */
@NgModule({
  declarations: [SafeChartSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TextFieldModule,
    SafeQueryBuilderModule,
    SafeChartModule,
    TabsModule,
    ExpansionPanelModule,
    TranslateModule,
    SafeAggregationBuilderModule,
    MatAutocompleteModule,
    SafeGridModule,
    SafeIconModule,
    SafePaletteControlModule,
    TabMainModule,
    TabDisplayModule,
    TooltipModule,
    SelectMenuModule,
    SelectOptionModule,
  ],
  exports: [SafeChartSettingsComponent],
})
export class SafeChartSettingsModule {}
