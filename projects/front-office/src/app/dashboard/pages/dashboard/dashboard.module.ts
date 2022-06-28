import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SafeWidgetGridModule } from '@safe/builder';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
