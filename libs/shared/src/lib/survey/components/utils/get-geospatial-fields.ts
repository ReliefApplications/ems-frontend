import { TranslateService } from '@ngx-translate/core';
import { GeoProperties } from '../../../components/geospatial-map/geospatial-map.interface';
import { ALL_FIELDS } from '../geofields-listbox/geofields-listbox.component';

/** Geo field, as stored in / displayed by the geospatial question */
type GeoFieldItem = { value: keyof GeoProperties; label: string };

/** i18n key prefix for the default geo field labels */
const GEO_FIELD_LABEL_PREFIX = 'components.formMapProperties.geofields.fields';

/**
 * Extract geofields from question ( to match with latest version of the available ones )
 *
 * @param question Geospatial question
 * @returns clean list of selected geofields
 */
export const getGeoFields = (question: any) => {
  const rawSelectedFields: any[] = (question.geoFields || []).map(
    (field: any) =>
      typeof field === 'string'
        ? {
            value: field,
            label: ALL_FIELDS.find((x) => x.value === field)?.label || field,
          }
        : field
  );
  return rawSelectedFields.filter((x) =>
    (ALL_FIELDS.map((field) => field.value) as string[]).includes(x.value)
  );
};

/**
 * Get the label to display for a geo field, translated into the current
 * language. Default labels (those still matching the built-in ALL_FIELDS
 * value) are translated; labels the user customized through the edit dialog
 * are kept as-is.
 *
 * @param field Geo field to get the display label for
 * @param translate Translation service
 * @returns The label to display
 */
export const getGeoFieldDisplayLabel = (
  field: GeoFieldItem,
  translate: TranslateService
): string => {
  const defaultLabel = ALL_FIELDS.find((x) => x.value === field.value)?.label;
  // A label that no longer matches the built-in default has been customized
  // by the user, so we leave it untouched.
  if (defaultLabel === undefined || field.label !== defaultLabel) {
    return field.label;
  }
  return translate.instant(`${GEO_FIELD_LABEL_PREFIX}.${field.value}`);
};
