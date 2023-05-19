import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsTabRoutingModule } from './records-tab-routing.module';
import { RecordsTabComponent } from './records-tab.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule, TableModule } from '@oort-front/ui';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeButtonModule,
  SafeSkeletonTableModule,
  SafeEmptyModule,
} from '@oort-front/safe';
import { UploadMenuModule } from '../../../../components/upload-menu/upload-menu.module';

/**
 * Records tab module for resource page.
 */
@NgModule({
  declarations: [RecordsTabComponent],
  imports: [
    CommonModule,
    RecordsTabRoutingModule,
    MatIconModule,
    MenuModule,
    SafeButtonModule,
    TooltipModule,
    MatPaginatorModule,
    TranslateModule,
    OverlayModule,
    UploadMenuModule,
    SafeSkeletonTableModule,
    SafeEmptyModule,
    TableModule,
  ],
})
export class RecordsTabModule {}
