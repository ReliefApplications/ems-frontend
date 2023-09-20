import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule, ButtonModule, IconModule } from '@oort-front/ui';
import { SafeEmptyModule } from '../ui/empty/empty.module';
import { SafeDrawerPositionerModule } from './directives/drawer-positioner/drawer-positioner.module';

/** Dashboard floating filter module. */
@NgModule({
  declarations: [DashboardFilterComponent],
  imports: [
    CommonModule,
    IconModule,
    TranslateModule,
    TooltipModule,
    ButtonModule,
    SafeEmptyModule,
    SafeDrawerPositionerModule,
  ],
  exports: [DashboardFilterComponent],
})
export class DashboardFilterModule {}
