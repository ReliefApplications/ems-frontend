import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Tabs widget settings
 */
@Component({
  selector: 'safe-application-widget-settings',
  templateUrl: './application-widget-settings.component.html',
  styleUrls: ['./application-widget-settings.component.scss'],
})
export class SafeApplicationWidgetSettingsComponent {
  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();
}
