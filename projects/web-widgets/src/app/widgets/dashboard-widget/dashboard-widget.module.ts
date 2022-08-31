import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardWidgetComponent } from './dashboard-widget.component';
import { DashboardModule } from '../../components/dashboard/dashboard.module';
import { MatSidenavModule } from '@angular/material/sidenav';

/** Dashboard web widget module */
@NgModule({
  declarations: [DashboardWidgetComponent],
  imports: [CommonModule, DashboardModule, MatSidenavModule],
  exports: [DashboardWidgetComponent],
})
export class DashboardWidgetModule {}
