import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordsTabRoutingModule } from './records-tab-routing.module';
import { RecordsTabComponent } from './records-tab.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeAccessModule,
  SafeButtonModule,
  SafeLayoutModalModule,
  SafeDateModule,
  SafeConfirmModalModule,
} from '@safe/builder';
import { UploadMenuModule } from 'projects/back-office/src/app/components/upload-menu/upload-menu.module';

@NgModule({
  declarations: [RecordsTabComponent],
  imports: [
    CommonModule,
    RecordsTabRoutingModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    SafeAccessModule,
    SafeButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    TranslateModule,
    SafeLayoutModalModule,
    OverlayModule,
    UploadMenuModule,
    SafeDateModule,
    SafeConfirmModalModule,
  ],
})
export class RecordsTabModule {}
