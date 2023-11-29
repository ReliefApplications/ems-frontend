import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWidgetComponent } from './grid.component';
import { CoreGridModule } from '../../ui/core-grid/core-grid.module';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { EmailPreviewModalModule } from '../../email-preview-modal/email-preview-modal.module';
import { AggregationGridModule } from '../../aggregation/aggregation-grid/aggregation-grid.module';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/** Module for grid widget component */
@NgModule({
  declarations: [GridWidgetComponent],
  imports: [
    CommonModule,
    CoreGridModule,
    DropDownListModule,
    EmailPreviewModalModule,
    AggregationGridModule,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
    TranslateModule,
  ],
  exports: [GridWidgetComponent],
})
export class GridWidgetModule {}
