import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  MenuModule,
  RadioModule,
  TooltipModule,
  TabsModule,
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
    TranslateModule,
    DisplaySettingsComponent,
    SummaryCardGeneralComponent,
    SafeTextEditorTabModule,
    SafeDisplayTabModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LayoutModule,
    TooltipModule,
    MenuModule,
    IconModule,
    SummaryCardItemModule,
    RadioModule,
    ButtonModule,
    FormWrapperModule,
    SafeSummaryCardModule,
    TabsModule,
  ],
  exports: [SafeSummaryCardSettingsComponent],
})
export class SafeSummaryCardSettingsModule {}
