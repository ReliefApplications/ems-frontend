import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
  SafeAccessModule,
  SafeRecordHistoryModule,
  SafeWidgetGridModule,
  SafeButtonModule,
  SafeSkeletonModule,
  SafeAlertModule,
  SafeSearchMenuModule,
  SafeIconModule,
  SafeModalModule,
  SafeEditableTextModule,
} from '@safe/builder';
import { ShareUrlComponent } from './components/share-url/share-url.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';

/**
 * Dashboard page module.
 */
@NgModule({
  declarations: [DashboardComponent, ShareUrlComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SafeAccessModule,
    SafeWidgetGridModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    ClipboardModule,
    SafeRecordHistoryModule,
    SafeButtonModule,
    SafeIconModule,
    TranslateModule,
    OverlayModule,
    SafeSearchMenuModule,
    SafeSkeletonModule,
    SafeAlertModule,
    SafeModalModule,
    SafeEditableTextModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
