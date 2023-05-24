import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeChartSettingsComponent } from './chart-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { SafeChartModule } from '../chart/chart.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { SafeButtonModule } from '../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeAggregationBuilderModule } from '../../ui/aggregation-builder/aggregation-builder.module';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { SafeGridModule } from '../../../components/ui/core-grid/grid/grid.module';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { SafePaletteControlModule } from '../../palette-control/palette-control.module';
import { TabMainModule } from './tab-main/tab-main.module';
import { TabDisplayModule } from './tab-display/tab-display.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';

/** Module for the chart settings component */
@NgModule({
  declarations: [SafeChartSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    TextFieldModule,
    SafeQueryBuilderModule,
    SafeChartModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatTabsModule,
    SafeButtonModule,
    TranslateModule,
    SafeAggregationBuilderModule,
    MatAutocompleteModule,
    MatChipsModule,
    SafeGridModule,
    SafeIconModule,
    SafePaletteControlModule,
    TabMainModule,
    TabDisplayModule,
    MatTooltipModule,
    DisplaySettingsComponent,
  ],
  exports: [SafeChartSettingsComponent],
})
export class SafeChartSettingsModule {}
