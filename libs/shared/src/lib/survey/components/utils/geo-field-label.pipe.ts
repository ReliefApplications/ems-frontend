import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GeoProperties } from '../../../components/geospatial-map/geospatial-map.interface';
import { getGeoFieldDisplayLabel } from './get-geospatial-fields';

/**
 * Display label for a geospatial field, translated into the current language.
 * Default labels are localized; labels customized by the user are kept as-is.
 * Impure so the label refreshes when the active language changes.
 */
@Pipe({
  name: 'geoFieldLabel',
  standalone: true,
  pure: false,
})
export class GeoFieldLabelPipe implements PipeTransform {
  /**
   * Display label pipe for a geospatial field.
   *
   * @param translate Translation service
   */
  constructor(private translate: TranslateService) {}

  /**
   * Translate the default label of a geo field, keeping custom labels as-is.
   *
   * @param field Geo field, with its `value` and stored `label`
   * @param field.value Geo field value
   * @param field.label Geo field label
   * @returns The label to display
   */
  transform(field: { value: keyof GeoProperties; label: string }): string {
    return getGeoFieldDisplayLabel(field, this.translate);
  }
}
