import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRecordsRoutingModule } from './form-records-routing.module';
import { FormRecordsComponent } from './form-records.component';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule, TableModule } from '@oort-front/ui';
import {
  SafeRecordHistoryModule,
  SafeButtonModule,
  SafeSkeletonTableModule,
} from '@oort-front/safe';
import { DividerModule, TooltipModule } from '@oort-front/ui';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { UploadMenuModule } from '../../../components/upload-menu/upload-menu.module';

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
    SafeButtonModule,
    MatPaginatorModule,
    TranslateModule,
    OverlayModule,
    UploadMenuModule,
    SafeSkeletonTableModule,
    TableModule,
  ],
  exports: [FormRecordsComponent],
})
export class FormRecordsModule {}
