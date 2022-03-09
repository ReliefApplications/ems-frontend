import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardWidgetComponent } from './dashboard-widget.component';
import { DashboardModule } from '../../components/dashboard/dashboard.module';

@NgModule({
  declarations: [DashboardWidgetComponent],
  imports: [CommonModule, DashboardModule],
  exports: [DashboardWidgetComponent],
})
export class DashboardWidgetModule {}
