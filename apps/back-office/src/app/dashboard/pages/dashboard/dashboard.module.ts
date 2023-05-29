import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
  SafeAccessModule,
  SafeRecordHistoryModule,
  SafeWidgetGridModule,
  SafeSkeletonModule,
  SafeSearchMenuModule,
  SafeIconModule,
  SafeEditableTextModule,
  FullScreenModule,
  SafeGraphQLSelectModule,
  DashboardFilterModule,
} from '@oort-front/safe';
import { ShareUrlComponent } from './components/share-url/share-url.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import {
  MenuModule,
  TooltipModule,
  ButtonModule,
  SelectMenuModule,
  SelectOptionModule,
  FormWrapperModule,
  AlertModule,
  DialogModule,
} from '@oort-front/ui';

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
    DialogModule,
    MenuModule,
    ClipboardModule,
    SafeRecordHistoryModule,
    SafeIconModule,
    TranslateModule,
    OverlayModule,
    SafeSearchMenuModule,
    SafeSkeletonModule,
    SafeEditableTextModule,
    FullScreenModule,
    SafeGraphQLSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    DashboardFilterModule,
    TooltipModule,
    ButtonModule,
    SelectMenuModule,
    SelectOptionModule,
    FormWrapperModule,
    AlertModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
