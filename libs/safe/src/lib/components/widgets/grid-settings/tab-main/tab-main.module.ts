import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { LayoutTableModule } from '../../../grid-layout/layout-table/layout-table.module';
import { SafeGraphQLSelectModule } from '../../../graphql-select/graphql-select.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
import { AggregationTableModule } from '../../../aggregation/aggregation-table/aggregation-table.module';
import { UiModule } from '@oort-front/ui';

/**
 * Main Tab of grid widget configuration modal.
 */
@NgModule({
  declarations: [TabMainComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    LayoutTableModule,
    SafeGraphQLSelectModule,
    MatTooltipModule,
    UiModule,
    SafeDividerModule,
    AggregationTableModule,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
