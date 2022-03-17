import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardWidgetComponent } from './dashboard-widget.component';
import { DashboardModule } from '../../components/dashboard/dashboard.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { AppOverlayContainer } from '../../utils/overlay-container';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@NgModule({
  declarations: [DashboardWidgetComponent],
  imports: [CommonModule, DashboardModule, MatSidenavModule, OverlayModule],
  exports: [DashboardWidgetComponent],
  providers: [{ provide: OverlayContainer, useClass: AppOverlayContainer }],
})
export class DashboardWidgetModule {}
