import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsSummaryComponent } from './applications-summary.component';
import { AddApplicationComponent } from './components/add-application/add-application.component';
import { ApplicationSummaryComponent } from './components/application-summary/application-summary.component';
import { IconModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from '../../directives/skeleton/skeleton.module';
import { DateModule } from '../../pipes/date/date.module';
import { MenuModule, DividerModule, ButtonModule } from '@oort-front/ui';
import { AbilityModule } from '@casl/angular';

/**
 * ApplicationsSummaryModule is a class used to manage all the modules and components
 * related to the applications summary block on the home page.
 */
@NgModule({
  declarations: [
    ApplicationsSummaryComponent,
    AddApplicationComponent,
    ApplicationSummaryComponent,
  ],
  imports: [
    CommonModule,
    MenuModule,
    IconModule,
    TranslateModule,
    SkeletonModule,
    DateModule,
    DividerModule,
    ButtonModule,
    TooltipModule,
    AbilityModule,
  ],
  exports: [
    ApplicationsSummaryComponent,
    AddApplicationComponent,
    ApplicationSummaryComponent,
  ],
})
export class ApplicationsSummaryModule {}
