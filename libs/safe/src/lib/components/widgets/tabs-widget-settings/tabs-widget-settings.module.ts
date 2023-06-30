import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafeTabsWidgetSettingsComponent } from './tabs-widget-settings.component';

/** Module for the tabs widget settings component */
@NgModule({
  declarations: [SafeTabsWidgetSettingsComponent],
  imports: [CommonModule],
  exports: [SafeTabsWidgetSettingsComponent],
})
export class SafeTabsWidgetSettingsModule {}
