import { Component, Input } from '@angular/core';

@Component({
  selector: 'safe-map-widget',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class SafeMapWidgetComponent {
  @Input() header = true;
  @Input() settings: any;
}
