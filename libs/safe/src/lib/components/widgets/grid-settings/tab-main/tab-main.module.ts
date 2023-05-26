import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { LayoutTableModule } from '../../../grid-layout/layout-table/layout-table.module';
import { SafeGraphQLSelectModule } from '../../../graphql-select/graphql-select.module';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import {
  TooltipModule,
  DividerModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { AggregationTableModule } from '../../../aggregation/aggregation-table/aggregation-table.module';

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
    FormWrapperModule,
    MatAutocompleteModule,
    MatSelectModule,
    LayoutTableModule,
    SafeGraphQLSelectModule,
    TooltipModule,
    SafeIconModule,
    DividerModule,
    AggregationTableModule,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
