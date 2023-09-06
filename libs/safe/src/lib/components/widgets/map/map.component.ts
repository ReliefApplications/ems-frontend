import { Component, Input } from '@angular/core';
import { MapWidgetSettings } from '../../../models/widgets/mapWidget.model';

/** Component for the map widget */
@Component({
  selector: 'safe-map-widget',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class SafeMapWidgetComponent {
  @Input() header = true;
  @Input() settings!: MapWidgetSettings;
}
