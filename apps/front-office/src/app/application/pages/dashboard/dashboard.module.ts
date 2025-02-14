import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
  ActionButtonsComponent,
  DashboardExportButtonComponent,
  DashboardFilterModule,
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
    ActionButtonsComponent,
    DashboardExportButtonComponent,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
