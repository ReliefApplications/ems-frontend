import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * General settings of the map widget:
 * - title
 * - query
 */
@Component({
  selector: 'safe-map-general',
  templateUrl: './map-general.component.html',
  styleUrls: ['./map-general.component.scss'],
})
export class MapGeneralComponent {
  @Input() form!: FormGroup;
}
