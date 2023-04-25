import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeIconModule } from '../ui/icon/icon.module';
import { SafeDrawerPositionerDirective } from './directives/drawer-positioner/drawer-positioner.directive';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

/** Cron expression control module. */
@NgModule({
  declarations: [DashboardFilterComponent, SafeDrawerPositionerDirective],
  imports: [
    CommonModule,
    SafeButtonModule,
    SafeIconModule,
    TranslateModule,
    MatTooltipModule,
  ],
  exports: [DashboardFilterComponent],
  providers: [SafeDrawerPositionerDirective],
})
export class DashboardFilterModule {}
