import { NgModule } from '@angular/core';
import { SafeSummaryCardSettingsComponent } from './summary-card-settings.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { SummaryCardGeneralComponent } from './summary-card-general/summary-card-general.component';

/** Summary Card Settings Module */
@NgModule({
  declarations: [SafeSummaryCardSettingsComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    SafeIconModule,
    MatTabsModule,
    TranslateModule,
    DisplaySettingsComponent,
    SummaryCardGeneralComponent,
  ],
  exports: [SafeSummaryCardSettingsComponent],
})
export class SafeSummaryCardSettingsModule {}
