import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoProperties } from '../geospatial-map.interface';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeoFieldLabelPipe } from '../../../survey/components/utils/geo-field-label.pipe';

/**
 * Geospatial fields component.
 */
@Component({
  selector: 'shared-geospatial-fields',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, GeoFieldLabelPipe],
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
