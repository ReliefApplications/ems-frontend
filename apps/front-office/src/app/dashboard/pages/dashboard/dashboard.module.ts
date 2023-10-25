import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
  DashboardFilterModule,
  FullScreenModule,
  SafeSkeletonModule,
  SafeWidgetGridModule,
} from '@oort-front/safe';
import { ButtonModule } from '@oort-front/ui';

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
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
