import { ALL_FIELDS } from '../../../components/geofields-listbox/geofields-listbox.component';

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
