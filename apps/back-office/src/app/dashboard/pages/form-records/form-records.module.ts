import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRecordsRoutingModule } from './form-records-routing.module';
import { FormRecordsComponent } from './form-records.component';
import { IconModule } from '@oort-front/ui';
import {
  RecordHistoryModule,
  SkeletonTableModule,
  EmptyModule,
  UploadRecordsModule,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import {
  DividerModule,
  TooltipModule,
  MenuModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
} from '@oort-front/ui';

/** Forms records page module */
@NgModule({
  declarations: [FormRecordsComponent],
  imports: [
    CommonModule,
    FormRecordsRoutingModule,
    IconModule,
    MenuModule,
    RecordHistoryModule,
    TooltipModule,
    DividerModule,
    PaginatorModule,
    TranslateModule,
    SkeletonTableModule,
    ButtonModule,
    TableModule,
    EmptyModule,
    UploadRecordsModule,
  ],
  exports: [FormRecordsComponent],
})
export class FormRecordsModule {}
