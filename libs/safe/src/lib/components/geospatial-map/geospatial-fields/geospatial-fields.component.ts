import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReverseGeocodeResult } from '../geospatial-map.interface';

@Component({
  selector: 'safe-geospatial-fields',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './geospatial-fields.component.html',
  styleUrls: ['./geospatial-fields.component.scss'],
})
export class GeospatialFieldsComponent {
  @Input() fields: (keyof ReverseGeocodeResult)[] = [];
  @Input() geoResult!: ReverseGeocodeResult;
}
