import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsTabRoutingModule } from './records-tab-routing.module';
import { RecordsTabComponent } from './records-tab.component';
import { DividerModule, IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  SkeletonTableModule,
  EmptyModule,
  UploadRecordsModule,
} from '@oort-front/shared';
import {
  TooltipModule,
  MenuModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
} from '@oort-front/ui';

/**
 * Records tab module for resource page.
 */
@NgModule({
  declarations: [RecordsTabComponent],
  imports: [
    CommonModule,
    RecordsTabRoutingModule,
    IconModule,
    MenuModule,
    TooltipModule,
    PaginatorModule,
    TranslateModule,
    SkeletonTableModule,
    EmptyModule,
    ButtonModule,
    TableModule,
    DividerModule,
    UploadRecordsModule,
  ],
})
export class RecordsTabModule {}
