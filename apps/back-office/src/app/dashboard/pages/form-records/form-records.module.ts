import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRecordsRoutingModule } from './form-records-routing.module';
import { FormRecordsComponent } from './form-records.component';
import { IconModule } from '@oort-front/ui';
import {
  RecordHistoryModule,
  SkeletonTableModule,
  EmptyModule,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { UploadMenuModule } from '../../../components/upload-menu/upload-menu.module';
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
    OverlayModule,
    UploadMenuModule,
    SkeletonTableModule,
    ButtonModule,
    TableModule,
    EmptyModule,
  ],
  exports: [FormRecordsComponent],
})
export class FormRecordsModule {}
