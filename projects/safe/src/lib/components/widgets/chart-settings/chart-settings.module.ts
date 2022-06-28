import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeChartSettingsComponent } from './chart-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { SafeChartModule } from '../chart/chart.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeButtonModule } from '../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeAggregationBuilderModule } from '../../ui/aggregation-builder/aggregation-builder.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { SafeGridModule } from '../../../components/ui/core-grid/grid/grid.module';
import { SafeIconModule } from '../../ui/icon/icon.module';

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
  ],
  exports: [SafeChartSettingsComponent],
})
export class SafeChartSettingsModule {}
