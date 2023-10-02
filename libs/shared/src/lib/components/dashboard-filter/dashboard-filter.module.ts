import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule, ButtonModule, IconModule } from '@oort-front/ui';
import { SafeEmptyModule } from '../ui/empty/empty.module';
import { SafeDrawerPositionerModule } from './directives/drawer-positioner/drawer-positioner.module';
import { DrawerPositionerDirective } from './directives/drawer-positioner/drawer-positioner.directive';
import { EmptyModule } from '../ui/empty/empty.module';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { SurveyModule } from 'survey-angular-ui';

/** Dashboard floating filter module. */
@NgModule({
  declarations: [DashboardFilterComponent, DrawerPositionerDirective],
  imports: [
    CommonModule,
    IconModule,
    TranslateModule,
    TooltipModule,
    ButtonModule,
    SafeEmptyModule,
    SafeDrawerPositionerModule,
  ],
  exports: [
    DashboardFilterComponent,
    EmptyModule,
    SurveyCreatorModule,
    SurveyModule,
  ],
  providers: [DrawerPositionerDirective],
})
export class DashboardFilterModule {}
