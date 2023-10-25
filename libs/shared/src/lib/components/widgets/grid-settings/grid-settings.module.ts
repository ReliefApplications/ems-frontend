import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridSettingsComponent } from './grid-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TabActionsModule } from '../common/tab-actions/tab-actions.module';
import { TabButtonsModule } from './tab-buttons/tab-buttons.module';
import { TabMainModule } from './tab-main/tab-main.module';
import {
  IconModule,
  TabsModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { SortingSettingsModule } from '../common/sorting-settings/sorting-settings.module';
import { ContextualFiltersSettingsComponent } from '../common/contextual-filters-settings/contextual-filters-settings.component';

/** Module for the grid widget settings component */
@NgModule({
  declarations: [GridSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    TranslateModule,
    IconModule,
    TabActionsModule,
    TabButtonsModule,
    TabMainModule,
    TooltipModule,
    DisplaySettingsComponent,
    SortingSettingsModule,
    ToggleModule,
    ContextualFiltersSettingsComponent,
  ],
  exports: [GridSettingsComponent],
})
export class GridSettingsModule {}
