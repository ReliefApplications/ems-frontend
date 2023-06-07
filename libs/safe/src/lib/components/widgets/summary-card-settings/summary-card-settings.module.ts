import { NgModule } from '@angular/core';
import { SafeSummaryCardSettingsComponent } from './summary-card-settings.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { SummaryCardGeneralComponent } from './summary-card-general/summary-card-general.component';
import { SafeTextEditorTabModule } from './text-editor-tab/text-editor.module';
import { SafeDisplayTabModule } from './display-tab/display.module';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { SafeSummaryCardModule } from '../summary-card/summary-card.module';

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
    SafeTextEditorTabModule,
    SafeDisplayTabModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    SafeSummaryCardModule,
  ],
  exports: [SafeSummaryCardSettingsComponent],
})
export class SafeSummaryCardSettingsModule {}
