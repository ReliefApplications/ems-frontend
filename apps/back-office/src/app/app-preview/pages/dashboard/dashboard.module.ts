import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { WidgetGridModule } from '@oort-front/shared';

/**
 * Dashboard page module for application preview.
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, WidgetGridModule],
  exports: [DashboardComponent],
})
export class DashboardModule {}
