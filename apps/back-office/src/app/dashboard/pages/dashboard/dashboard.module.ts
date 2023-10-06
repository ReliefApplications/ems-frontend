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
  SafeEditableTextModule,
  FullScreenModule,
  DashboardFilterModule,
} from '@oort-front/safe';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MenuModule,
  TooltipModule,
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  AlertModule,
  DialogModule,
  GraphQLSelectModule,
} from '@oort-front/ui';

/**
 * Dashboard page module.
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SafeAccessModule,
    SafeWidgetGridModule,
    IconModule,
    DialogModule,
    MenuModule,
    ClipboardModule,
    SafeRecordHistoryModule,
    TranslateModule,
    OverlayModule,
    SafeSearchMenuModule,
    SafeSkeletonModule,
    SafeEditableTextModule,
    FullScreenModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardFilterModule,
    TooltipModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    GraphQLSelectModule,
    AlertModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
