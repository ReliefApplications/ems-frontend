import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {
  SafeApplicationToolbarModule,
  SafeLayoutModule,
  SafeLeftSidenavModule,
} from '@oort-front/safe';

/**
 * Front-Office Dashboard module.
 * Accessible if user is authenticated.
 * Main Navigation.
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    SafeLayoutModule,
    SafeLeftSidenavModule,
    DashboardRoutingModule,
    SafeApplicationToolbarModule,
  ],
})
export class DashboardModule {}
