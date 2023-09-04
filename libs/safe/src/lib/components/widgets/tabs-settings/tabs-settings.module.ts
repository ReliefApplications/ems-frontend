import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsSettingsComponent } from './tabs-settings.component';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabMainModule } from './tab-main/tab-main.module';

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
    TabMainModule,
  ],
  exports: [TabsSettingsComponent],
})
export class TabsSettingsModule {}
