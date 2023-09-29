import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutTableModule } from '../../../grid-layout/layout-table/layout-table.module';
import { DividerModule, FormWrapperModule } from '@oort-front/ui';
import { AggregationTableModule } from '../../../aggregation/aggregation-table/aggregation-table.module';
import { AggregationOriginSelectComponent } from '../../../aggregation/aggregation-origin-select/aggregation-origin-select.component';

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
    FormWrapperModule,
    LayoutTableModule,
    DividerModule,
    AggregationTableModule,
    AggregationOriginSelectComponent,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
