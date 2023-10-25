import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationsSummaryComponent } from './applications-summary.component';
import { SafeAddApplicationComponent } from './components/add-application/add-application.component';
import { SafeApplicationSummaryComponent } from './components/application-summary/application-summary.component';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonModule } from '../../directives/skeleton/skeleton.module';
import { SafeDateModule } from '../../pipes/date/date.module';
import { MenuModule, DividerModule, ButtonModule } from '@oort-front/ui';

/**
 * SafeApplicationsSummaryModule is a class used to manage all the modules and components
 * related to the applications summary block on the home page.
 */
@NgModule({
  declarations: [
    SafeApplicationsSummaryComponent,
    SafeAddApplicationComponent,
    SafeApplicationSummaryComponent,
  ],
  imports: [
    CommonModule,
    MenuModule,
    IconModule,
    TranslateModule,
    SafeSkeletonModule,
    SafeDateModule,
    DividerModule,
    ButtonModule,
  ],
  exports: [
    SafeApplicationsSummaryComponent,
    SafeAddApplicationComponent,
    SafeApplicationSummaryComponent,
  ],
})
export class SafeApplicationsSummaryModule {}
