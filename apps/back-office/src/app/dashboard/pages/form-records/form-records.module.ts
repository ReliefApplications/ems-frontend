import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRecordsRoutingModule } from './form-records-routing.module';
import { FormRecordsComponent } from './form-records.component';
import { MatIconModule } from '@angular/material/icon';
import {
  SafeRecordHistoryModule,
  SafeSkeletonTableModule,
  SafeEmptyModule,
} from '@oort-front/safe';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { UploadMenuModule } from '../../../components/upload-menu/upload-menu.module';
import {
  DividerModule,
  TooltipModule,
  MenuModule,
  ButtonModule,
  TableModule,
} from '@oort-front/ui';

/** Forms records page module */
@NgModule({
  declarations: [FormRecordsComponent],
  imports: [
    CommonModule,
    FormRecordsRoutingModule,
    MatIconModule,
    MenuModule,
    SafeRecordHistoryModule,
    TooltipModule,
    DividerModule,
    MatPaginatorModule,
    TranslateModule,
    OverlayModule,
    UploadMenuModule,
    SafeSkeletonTableModule,
    ButtonModule,
    TableModule,
    SafeEmptyModule,
  ],
  exports: [FormRecordsComponent],
})
export class FormRecordsModule {}
