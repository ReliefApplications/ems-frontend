import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { SafeDrawerPositionerDirective } from './directives/drawer-positioner/drawer-positioner.directive';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule, ButtonModule, IconModule } from '@oort-front/ui';
import { SafeEmptyModule } from '../ui/empty/empty.module';

/** Cron expression control module. */
@NgModule({
  declarations: [DashboardFilterComponent, SafeDrawerPositionerDirective],
  imports: [
    CommonModule,
    IconModule,
    TranslateModule,
    TooltipModule,
    ButtonModule,
    SafeEmptyModule,
  ],
  exports: [DashboardFilterComponent],
  providers: [SafeDrawerPositionerDirective],
})
export class DashboardFilterModule {}
