import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsTabRoutingModule } from './records-tab-routing.module';
import { RecordsTabComponent } from './records-tab.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DividerModule, IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule, SafeEmptyModule } from '@oort-front/safe';
import { UploadMenuModule } from '../../../../components/upload-menu/upload-menu.module';
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
    OverlayModule,
    UploadMenuModule,
    SafeSkeletonTableModule,
    SafeEmptyModule,
    ButtonModule,
    TableModule,
    DividerModule,
  ],
})
export class RecordsTabModule {}
