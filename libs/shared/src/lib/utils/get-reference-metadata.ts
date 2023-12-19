import { Metadata } from '../models/metadata.model';
import { ReferenceData } from '../models/reference-data.model';

/**
 * Given a field type, return the related editor type for filtering
 *
 * @param field Field to display in the editor
 * @returns editor type related to the field type given
 */
const getEditor = (field: any) => {
  switch (field.type) {
    case 'boolean': {
      return 'boolean';
    }
    case 'number': {
      return 'numeric';
    }
    case 'string': {
      return 'text';
    }
    default: {
      return '';
    }
  }
};

/**
 * Map given reference data fields into meta data type
 *
 * @param referenceData Reference data from where to extract the meta data
 * @returns reference data fields array mapped as meta data
 */
export function getReferenceMetadata(referenceData: ReferenceData): Metadata[] {
  const refDataMeta: Metadata[] = [];
  (referenceData.fields ?? []).forEach((field) => {
    const meta: Metadata = {
      name: field.graphQLFieldName || field.name,
      type: field.type,
      automated: false,
      filterable: !['object', 'array'].includes(field.type),
      editor: getEditor(field),
    };
    refDataMeta.push(meta);
  });
  return refDataMeta;
}
