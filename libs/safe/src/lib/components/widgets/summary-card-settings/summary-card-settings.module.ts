import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  MenuModule,
  RadioModule,
  TooltipModule,
} from '@oort-front/ui';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { SummaryCardItemModule } from '../summary-card/summary-card-item/summary-card-item.module';
import { SafeSummaryCardModule } from '../summary-card/summary-card.module';
import { SafeDisplayTabModule } from './display-tab/display.module';
import { SummaryCardGeneralComponent } from './summary-card-general/summary-card-general.component';
import { SafeSummaryCardSettingsComponent } from './summary-card-settings.component';
import { SafeTextEditorTabModule } from './text-editor-tab/text-editor.module';

/** Summary Card Settings Module */
@NgModule({
  declarations: [SafeSummaryCardSettingsComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatTabsModule,
    TranslateModule,
    DisplaySettingsComponent,
    SummaryCardGeneralComponent,
    SafeTextEditorTabModule,
    SafeDisplayTabModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
    LayoutModule,
    TooltipModule,
    MenuModule,
    IconModule,
    MatDividerModule,
    MatButtonModule,
    SummaryCardItemModule,
    RadioModule,
    ButtonModule,
    FormWrapperModule,
    MatRadioModule,
    SafeSummaryCardModule,
  ],
  exports: [SafeSummaryCardSettingsComponent],
})
export class SafeSummaryCardSettingsModule {}
