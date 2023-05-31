import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridSettingsComponent } from './grid-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TabActionsModule } from './tab-actions/tab-actions.module';
import { TabButtonsModule } from './tab-buttons/tab-buttons.module';
import { TabMainModule } from './tab-main/tab-main.module';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';

/** Module for the grid widget settings component */
@NgModule({
  declarations: [SafeGridSettingsComponent],
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
  ],
  exports: [SafeGridSettingsComponent],
})
export class SafeGridSettingsModule {}
