import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSettingsComponent } from './form-settings.component';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextualFiltersSettingsComponent } from '../common/contextual-filters-settings/contextual-filters-settings.component';
import { TabMainModule } from './tab-main/tab-main.module';
import { TabMapQuestionStateModule } from './tab-map-question-state/tab-map-question-state.module';
/**
 * Tabs widget settings module.
 */
@NgModule({
  declarations: [FormSettingsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    DisplaySettingsComponent,
    TooltipModule,
    TabMainModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    ContextualFiltersSettingsComponent,
    TabMapQuestionStateModule,
  ],
  exports: [FormSettingsComponent],
})
export class FormSettingsModule {}
