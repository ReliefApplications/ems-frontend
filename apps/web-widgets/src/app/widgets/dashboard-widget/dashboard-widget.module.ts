import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardWidgetComponent } from './dashboard-widget.component';
import { DashboardModule } from '../../components/dashboard/dashboard.module';
import { SidenavContainerModule } from '@oort-front/ui';

/** Dashboard web widget module */
@NgModule({
  declarations: [DashboardWidgetComponent],
  imports: [CommonModule, DashboardModule, SidenavContainerModule],
  exports: [DashboardWidgetComponent],
})
export class DashboardWidgetModule {}
