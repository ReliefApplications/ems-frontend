import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridWidgetComponent } from './grid.component';
import { SafeCoreGridModule } from '../../ui/core-grid/core-grid.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { SafeEmailPreviewModule } from '../../email-preview/email-preview.module';
import { SafeAggregationGridModule } from '../../aggregation/aggregation-grid/aggregation-grid.module';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/** Module for grid widget component */
@NgModule({
  declarations: [SafeGridWidgetComponent],
  imports: [
    CommonModule,
    SafeCoreGridModule,
    LayoutModule,
    DropDownListModule,
    SafeEmailPreviewModule,
    SafeAggregationGridModule,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
    TranslateModule,
  ],
  exports: [SafeGridWidgetComponent],
})
export class SafeGridWidgetModule {}
