import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule, ButtonModule, IconModule } from '@oort-front/ui';
import { EmptyModule } from '../ui/empty/empty.module';
import { DrawerPositionerModule } from './directives/drawer-positioner/drawer-positioner.module';
import { DrawerPositionerDirective } from './directives/drawer-positioner/drawer-positioner.directive';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { SurveyModule } from 'survey-angular-ui';

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
    SurveyCreatorModule,
    SurveyModule,
    DrawerPositionerModule,
  ],
  exports: [DashboardFilterComponent],
  providers: [DrawerPositionerDirective],
})
export class DashboardFilterModule {}
