import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { DrawerPositionerDirective } from './directives/drawer-positioner/drawer-positioner.directive';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule, ButtonModule, IconModule } from '@oort-front/ui';
import { EmptyModule } from '../ui/empty/empty.module';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { SurveyModule } from 'survey-angular-ui';

/** Cron expression control module. */
@NgModule({
  declarations: [DashboardFilterComponent, DrawerPositionerDirective],
  imports: [
    CommonModule,
    IconModule,
    TranslateModule,
    TooltipModule,
    ButtonModule,
    EmptyModule,
    SurveyCreatorModule,
    SurveyModule,
  ],
  exports: [DashboardFilterComponent],
  providers: [DrawerPositionerDirective],
})
export class DashboardFilterModule {}
