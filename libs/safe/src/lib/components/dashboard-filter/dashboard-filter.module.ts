import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeIconModule } from '../ui/icon/icon.module';
import { SafeDrawerPositionerDirective } from './directives/drawer-positioner/drawer-positioner.directive';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from '@oort-front/ui';

/** Cron expression control module. */
@NgModule({
  declarations: [DashboardFilterComponent, SafeDrawerPositionerDirective],
  imports: [
    CommonModule,
    SafeButtonModule,
    SafeIconModule,
    TranslateModule,
    TooltipModule,
  ],
  exports: [DashboardFilterComponent],
  providers: [SafeDrawerPositionerDirective],
})
export class DashboardFilterModule {}
