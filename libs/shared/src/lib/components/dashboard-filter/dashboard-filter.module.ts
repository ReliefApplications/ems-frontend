import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule, ButtonModule, IconModule } from '@oort-front/ui';
import { EmptyModule } from '../ui/empty/empty.module';
import { DrawerPositionerModule } from './directives/drawer-positioner/drawer-positioner.module';
import { DrawerPositionerDirective } from './directives/drawer-positioner/drawer-positioner.directive';
import { SurveyModule } from 'survey-angular-ui';
import { ModernDrawerPositionerModule } from './directives/modern-drawer-positioner/modern-drawer-positioner.module';

/** Dashboard floating filter module. */
@NgModule({
  declarations: [DashboardFilterComponent],
  imports: [
    CommonModule,
    IconModule,
    TranslateModule,
    TooltipModule,
    ButtonModule,
    EmptyModule,
    SurveyModule,
    DrawerPositionerModule,
    ModernDrawerPositionerModule,
  ],
  exports: [DashboardFilterComponent],
  providers: [DrawerPositionerDirective],
})
export class DashboardFilterModule {}
