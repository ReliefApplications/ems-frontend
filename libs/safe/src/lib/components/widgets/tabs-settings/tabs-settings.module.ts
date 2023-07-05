import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsSettingsComponent } from './tabs-settings.component';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralTabModule } from './tabs/general-tab/general-tab.module';
import { TabsTabModule } from './tabs/tabs-tab/tabs-tab.module';

@NgModule({
  declarations: [TabsSettingsComponent],
  imports: [
    CommonModule,
    TabsModule,
    TranslateModule,
    IconModule,
    TooltipModule,
    DisplaySettingsComponent,
    FormsModule,
    ReactiveFormsModule,
    // Tabs
    GeneralTabModule,
    TabsTabModule,
  ],
  exports: [TabsSettingsComponent],
})
export class TabsSettingsModule {}
