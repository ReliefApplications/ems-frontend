import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridSettingsComponent } from './grid-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SafeButtonModule } from '../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { TabActionsModule } from './tab-actions/tab-actions.module';
import { TabButtonsModule } from './tab-buttons/tab-buttons.module';
import { TabMainModule } from './tab-main/tab-main.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeTabSettingsOptionsModule } from '../../ui/tab-settings-options/tab-settings-options.module';

/** Module for the grid widget settings component */
@NgModule({
  declarations: [SafeGridSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SafeButtonModule,
    TranslateModule,
    SafeIconModule,
    SafeTabSettingsOptionsModule,
    TabActionsModule,
    TabButtonsModule,
    TabMainModule,
    MatTooltipModule,
  ],
  exports: [SafeGridSettingsComponent],
})
export class SafeGridSettingsModule {}
