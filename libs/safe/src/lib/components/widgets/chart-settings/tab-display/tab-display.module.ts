import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabDisplayComponent } from './tab-display.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { TranslateModule } from '@ngx-translate/core';
import { SafePaletteControlModule } from '../../../palette-control/palette-control.module';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { SafeAggregationBuilderModule } from '../../../ui/aggregation-builder/aggregation-builder.module';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeGridModule } from '../../../ui/core-grid/grid/grid.module';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { SafeChartModule } from '../../chart/chart.module';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SeriesSettingsModule } from '../series-settings/series-settings.module';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

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
    InputsModule,
    SeriesSettingsModule,
    SafeDividerModule,
    MatTooltipModule,
  ],
  exports: [TabDisplayComponent],
})
export class TabDisplayModule {}
