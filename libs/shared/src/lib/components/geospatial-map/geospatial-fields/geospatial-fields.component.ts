import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoProperties } from '../geospatial-map.interface';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Geospatial fields component.
 */
@Component({
  selector: 'shared-geospatial-fields',
  standalone: true,
  imports: [
    CommonModule,
    LabelModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './geospatial-fields.component.html',
  styleUrls: ['./geospatial-fields.component.scss'],
})
export class GeospatialFieldsComponent {
  /**
   * Fields to display
   */
  @Input() fields: { value: keyof GeoProperties; label: string }[] = [];
  /**
   * Form group
   */
  @Input() geoForm!: FormGroup;
}
