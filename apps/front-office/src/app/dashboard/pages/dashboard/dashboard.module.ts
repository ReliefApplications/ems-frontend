import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
  DashboardFilterModule,
  FullScreenModule,
  SafeButtonModule,
  SafeSkeletonModule,
  SafeWidgetGridModule,
} from '@oort-front/safe';
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
    SafeButtonModule,
    DashboardFilterModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
