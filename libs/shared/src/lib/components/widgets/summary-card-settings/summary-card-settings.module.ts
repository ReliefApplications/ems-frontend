import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  DividerModule,
  IconModule,
  MenuModule,
  RadioModule,
  TooltipModule,
  TabsModule,
  ToggleModule,
} from '@oort-front/ui';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { SummaryCardItemModule } from '../summary-card/summary-card-item/summary-card-item.module';
import { SummaryCardModule } from '../summary-card/summary-card.module';
import { DisplayTabModule } from './display-tab/display.module';
import { SummaryCardGeneralComponent } from './summary-card-general/summary-card-general.component';
import { SummaryCardSettingsComponent } from './summary-card-settings.component';
import { TextEditorTabModule } from './text-editor-tab/text-editor.module';
import { SortingSettingsModule } from '../common/sorting-settings/sorting-settings.module';
import { ContextualFiltersSettingsComponent } from '../common/contextual-filters-settings/contextual-filters-settings.component';
import { TabActionsModule } from '../common/tab-actions/tab-actions.module';

/** Summary Card Settings Module */
@NgModule({
  declarations: [SummaryCardSettingsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    DisplaySettingsComponent,
    SummaryCardGeneralComponent,
    TextEditorTabModule,
    DisplayTabModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TooltipModule,
    MenuModule,
    IconModule,
    DividerModule,
    SummaryCardItemModule,
    RadioModule,
    ButtonModule,
    FormWrapperModule,
    SummaryCardModule,
    TabsModule,
    ToggleModule,
    SortingSettingsModule,
    ContextualFiltersSettingsComponent,
    TabActionsModule,
  ],
  exports: [SummaryCardSettingsComponent],
})
export class SummaryCardSettingsModule {}
