import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsSettingsComponent } from './tabs-settings.component';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  ],
  exports: [TabsSettingsComponent],
})
export class TabsSettingsModule {}
