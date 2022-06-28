import { Component, Input } from '@angular/core';

/**
 * Component for the popup of a marker on the map
 */
@Component({
  selector: 'safe-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss'],
})
export class SafeMapPopupComponent {
  @Input() displayFields: string[] = [];
  @Input() data: any;
}
