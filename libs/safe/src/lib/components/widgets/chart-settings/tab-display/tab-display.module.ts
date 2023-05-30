import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabDisplayComponent } from './tab-display.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SafePaletteControlModule } from '../../../palette-control/palette-control.module';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { SafeAggregationBuilderModule } from '../../../ui/aggregation-builder/aggregation-builder.module';
import { SafeGridModule } from '../../../ui/core-grid/grid/grid.module';
import { SafeIconModule } from '../../../ui/icon/icon.module';
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
    MatFormFieldModule,
    FormWrapperModule,
    MatButtonModule,
    MatIconModule,
    TextFieldModule,
    SafeQueryBuilderModule,
    SafeChartModule,
    ExpansionPanelModule,
    ToggleModule,
    TabsModule,
    TranslateModule,
    SafeAggregationBuilderModule,
    MatAutocompleteModule,
    SafeGridModule,
    SafeIconModule,
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
