import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SafeLayoutModule, SafeLeftSidenavModule } from '@safe/builder';

/**
 * Main BO dashboard module.
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    SafeLayoutModule,
    SafeLeftSidenavModule,
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
