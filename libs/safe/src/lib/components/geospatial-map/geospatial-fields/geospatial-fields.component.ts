import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReverseGeocodeResult } from '../geospatial-map.interface';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'safe-geospatial-fields',
  standalone: true,
  imports: [CommonModule, LabelModule, InputsModule],
  templateUrl: './geospatial-fields.component.html',
  styleUrls: ['./geospatial-fields.component.scss'],
})
export class GeospatialFieldsComponent {
  @Input() fields: (keyof ReverseGeocodeResult)[] = [];
  @Input() geoResult!: ReverseGeocodeResult;
}
