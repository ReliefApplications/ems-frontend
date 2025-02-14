import { JsonMetadata, Question, Serializer } from 'survey-core';
import { CS_DOCUMENTS_PROPERTIES } from '../../services/document-management/document-management.service';
import { registerCustomPropertyEditor } from '../components/utils/component-register';
import { CustomPropertyGridComponentTypes } from '../components/utils/components.enum';
import { isNil } from 'lodash';

/** Related occurrence category name */
const RELATED_OCCURRENCE_CATEGORY = 'Related Occurrence';
/** Document properties category name */
const DOCUMENT_PROPERTIES_CATEGORY = 'Document Properties';

/**
 * Add support for custom properties to the survey
 */
export const init = (): void => {
  // declare the serializer
  const serializer: JsonMetadata = Serializer;
  let index = 0;

  // Sort for all queries in settings
  serializer.addProperty('file', {
    category: DOCUMENT_PROPERTIES_CATEGORY,
    name: `querySort`,
    visible: true,
    default: 'ASC',
    choices: ['ASC', 'DESC'],
    visibleIndex: index,
    required: true,
  });
  index += 1;

  CS_DOCUMENTS_PROPERTIES.forEach((property) => {
    // Related Occurrence category (for fetching correct drive id to upload files)
    if (property.value === 'occurrences') {
      serializer.addProperty('file', {
        category: RELATED_OCCURRENCE_CATEGORY,
        type: CustomPropertyGridComponentTypes.csDocsPropertiesDropdown,
        name: property.value,
        displayName: property.text,
        default: property.value,
        required: true,
        visibleIf: (obj: any) => {
          if (
            isNil(obj) ||
            isNil(obj['OccurrenceType']) ||
            obj['OccurrenceType'] === ''
          ) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 1,
      });
      serializer.addProperty('file', {
        category: RELATED_OCCURRENCE_CATEGORY,
        type: 'expression',
        name: 'valueExpressionOccurrence',
        displayName: 'Value expression for ' + property.text,
        visibleIndex: 2,
      });
      serializer.addProperty('file', {
        category: RELATED_OCCURRENCE_CATEGORY,
        name: 'Occurrence',
        required: true,
        visible: false,
      });
    }
    // else, all other properties
    if (property.bodyKey) {
      if (property.value === 'occurrencetypes') {
        serializer.addProperty('file', {
          category: RELATED_OCCURRENCE_CATEGORY,
          type: CustomPropertyGridComponentTypes.csDocsPropertiesDropdown,
          name: property.value,
          displayName: property.text,
          default: property.value,
          required: true,
          visibleIndex: 0,
        });
      } else {
        // Select properties value
        serializer.addProperty('file', {
          category: DOCUMENT_PROPERTIES_CATEGORY,
          type: CustomPropertyGridComponentTypes.csDocsPropertiesDropdown,
          name: property.value,
          displayName: property.text,
          default: property.value,
          required: true,
          visibleIndex: index,
        });
        index += 1;

        // Add expression builder to dynamically set the value
        serializer.addProperty('file', {
          category: DOCUMENT_PROPERTIES_CATEGORY,
          type: 'expression',
          name: `valueExpression${property.bodyKey}`,
          displayName: 'Value expression for ' + property.text,
          visibleIndex: index,
        });
        index += 1;

        // Use field mapping
        serializer.addProperty('file', {
          category: DOCUMENT_PROPERTIES_CATEGORY,
          name: `convertFrom${property.bodyKey}`,
          displayName: `Convert from field for ${property.text} to id`,
          visibleIndex: index,
          visibleIf: (question: Question) => {
            return !!question[`valueExpression${property.bodyKey}`];
          },
        });
        index += 1;
      }

      serializer.addProperty('file', {
        category: DOCUMENT_PROPERTIES_CATEGORY,
        name: property.bodyKey,
        visible: false,
        required: true,
      });
    }
  });

  //  CS Documentation Properties dropdown
  registerCustomPropertyEditor(
    CustomPropertyGridComponentTypes.csDocsPropertiesDropdown
  );
};
