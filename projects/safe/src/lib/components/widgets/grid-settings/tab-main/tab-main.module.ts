import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { LayoutTableModule } from '../../../grid-layout/layout-table/layout-table.module';
import { SafeGraphQLSelectModule } from '../../../graphql-select/graphql-select.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
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
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    LayoutTableModule,
    SafeGraphQLSelectModule,
    MatTooltipModule,
    SafeIconModule,
    SafeDividerModule,
    AggregationTableModule,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
