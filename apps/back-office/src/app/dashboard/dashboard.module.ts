import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutModule, NavbarModule } from '@oort-front/shared';

/**
 * Main BO dashboard module.
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    LayoutModule,
    DashboardRoutingModule,
    NavbarModule,
  ],
})
export class DashboardModule {}
