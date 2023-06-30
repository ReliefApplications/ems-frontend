import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafeApplicationWidgetSettingsComponent } from './application-widget-settings.component';

/** Module for the tabs widget settings component */
@NgModule({
  declarations: [SafeApplicationWidgetSettingsComponent],
  imports: [CommonModule],
  exports: [SafeApplicationWidgetSettingsComponent],
})
export class SafeApplicationWidgetSettingsModule {}
