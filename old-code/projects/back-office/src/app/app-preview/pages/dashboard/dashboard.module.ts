import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SafeWidgetGridModule } from '@safe/builder';

/**
 * Dashboard page module for application preview.
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, SafeWidgetGridModule],
  exports: [DashboardComponent],
})
export class DashboardModule {}
