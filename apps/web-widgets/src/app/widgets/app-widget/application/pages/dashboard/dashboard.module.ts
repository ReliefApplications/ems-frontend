import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
  ButtonActionModule,
  DashboardFilterModule,
  EmptyModule,
  FullScreenModule,
  SkeletonModule,
  WidgetGridModule,
} from '@oort-front/shared';
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
    WidgetGridModule,
    FullScreenModule,
    SkeletonModule,
    ButtonModule,
    DashboardFilterModule,
    TooltipModule,
    TranslateModule,
    ButtonActionModule,
    EmptyModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
