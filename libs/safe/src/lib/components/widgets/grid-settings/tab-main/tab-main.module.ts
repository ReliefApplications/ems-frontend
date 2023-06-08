import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { LayoutTableModule } from '../../../grid-layout/layout-table/layout-table.module';
import {
  TooltipModule,
  DividerModule,
  FormWrapperModule,
  SelectMenuModule,
  GraphQLSelectModule,
  IconModule,
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
    LayoutTableModule,
    GraphQLSelectModule,
    TooltipModule,
    IconModule,
    DividerModule,
    AggregationTableModule,
    SelectMenuModule,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
