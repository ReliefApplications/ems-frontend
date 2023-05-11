import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationsSummaryComponent } from './applications-summary.component';
import { SafeAddApplicationComponent } from './components/add-application/add-application.component';
import { SafeApplicationSummaryComponent } from './components/application-summary/application-summary.component';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonModule } from '../../directives/skeleton/skeleton.module';
import { SafeDateModule } from '../../pipes/date/date.module';
import { SafeDividerModule } from '../ui/divider/divider.module';
import { UiModule } from '@oort-front/ui';

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
    MatRippleModule,
    MatMenuModule,
    SafeButtonModule,
    TranslateModule,
    SafeSkeletonModule,
    SafeDateModule,
    SafeDividerModule,
    UiModule,
  ],
  exports: [
    SafeApplicationsSummaryComponent,
    SafeAddApplicationComponent,
    SafeApplicationSummaryComponent,
  ],
})
export class SafeApplicationsSummaryModule {}
