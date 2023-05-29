import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {
  ExpansionPanelModule,
  GraphQLSelectModule,
  SelectMenuModule,
  SelectOptionModule,
} from '@oort-front/ui';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafePaletteControlModule } from '../../../palette-control/palette-control.module';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { SafeAggregationBuilderModule } from '../../../ui/aggregation-builder/aggregation-builder.module';
import { SafeGridModule } from '../../../ui/core-grid/grid/grid.module';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { SafeChartModule } from '../../chart/chart.module';
import { SafeSeriesMappingModule } from '../../../ui/aggregation-builder/series-mapping/series-mapping.module';
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
    MatFormFieldModule,
    FormWrapperModule,
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
    GraphQLSelectModule,
    SafeSeriesMappingModule,
    ButtonModule,
    SelectOptionModule,
    SelectMenuModule,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
