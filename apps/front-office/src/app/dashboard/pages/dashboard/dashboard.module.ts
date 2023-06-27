import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
  ButtonActionModule,
  DashboardFilterModule,
  FullScreenModule,
  SafeSkeletonModule,
  SafeWidgetGridModule,
} from '@oort-front/safe';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Dashboard page.
 * Dashboard is one of the available content types of application pages.
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SafeWidgetGridModule,
    FullScreenModule,
    SafeSkeletonModule,
    ButtonModule,
    DashboardFilterModule,
    TooltipModule,
    TranslateModule,
    ButtonActionModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
