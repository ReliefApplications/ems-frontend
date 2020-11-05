import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { WhoWidgetGridModule } from 'who-shared';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatProgressSpinnerModule,
    WhoWidgetGridModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
