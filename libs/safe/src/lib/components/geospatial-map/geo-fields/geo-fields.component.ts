import { Component, Input } from '@angular/core';
import { ReverseGeocodeResult } from '../geospatial-map.component';

/** Component for display geo fields information */
@Component({
  selector: 'safe-geo-fields',
  templateUrl: './geo-fields.component.html',
  styleUrls: ['./geo-fields.component.scss'],
})
export class SafeGeoFieldsComponent {
  @Input() geoFields: (keyof ReverseGeocodeResult)[] = [];
  @Input() geocodingResult!: ReverseGeocodeResult;
}
