import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWidgetComponent } from './grid.component';
import { CoreGridModule } from '../../ui/core-grid/core-grid.module';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { AggregationGridModule } from '../../aggregation/aggregation-grid/aggregation-grid.module';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ReferenceDataGridModule } from '../../ui/reference-data-grid/reference-data-grid.module';

/** Module for grid widget component */
@NgModule({
  declarations: [GridWidgetComponent],
  imports: [
    CommonModule,
    CoreGridModule,
    DropDownListModule,
    AggregationGridModule,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
    TranslateModule,
    ReferenceDataGridModule,
  ],
  exports: [GridWidgetComponent],
})
export class GridWidgetModule {}
