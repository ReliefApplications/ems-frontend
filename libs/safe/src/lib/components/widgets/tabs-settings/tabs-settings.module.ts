import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsSettingsComponent } from './tabs-settings.component';
import {
  ButtonModule,
  IconModule,
  TabsModule,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabSettingsModule } from './tab-settings/tab-settings.module';

/**
 * Tabs widget settings module.
 */
@NgModule({
  declarations: [TabsSettingsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    DisplaySettingsComponent,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    ButtonModule,
    TabSettingsModule,
  ],
  exports: [TabsSettingsComponent],
})
export class TabsSettingsModule {}
