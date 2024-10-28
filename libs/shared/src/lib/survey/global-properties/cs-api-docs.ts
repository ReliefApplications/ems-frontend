import { InMemoryCache } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { JsonMetadata, Serializer } from 'survey-core';
import { CS_DOCUMENTS_PROPERTIES } from '../../services/document-management/document-management.service';
import { registerCustomPropertyEditor } from '../components/utils/component-register';
import { CustomPropertyGridComponentTypes } from '../components/utils/components.enum';
import { isNil } from 'lodash';

/**
 * Add support for custom properties to the survey
 *
 * @param csApiUrl Cs Documents endpoint
 * @param apollo Angular Apollo client
 * @param httpLink Apollo http link
 */
export const init = (
  csApiUrl: string,
  apollo: Apollo,
  httpLink: HttpLink
): void => {
  const token = localStorage.getItem('access_token');
  apollo.removeClient('csDocApi');
  apollo.createNamed('csDocApi', {
    cache: new InMemoryCache(),
    link: httpLink.create({
      uri: `${csApiUrl}/graphql`,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: 'application/json; charset=utf-8',
        UserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        Authorization: `Bearer ${token}`,
      } as any,
    }),
  });

  // declare the serializer
  const serializer: JsonMetadata = Serializer;
  let index = 0;
  CS_DOCUMENTS_PROPERTIES.forEach((property) => {
    index = index + 1;
    // Related Occurrence category (for fetching correct drive id to upload files)
    if (property.value === 'occurrences') {
      serializer.addProperty('file', {
        category: 'Related Occurrence',
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
        category: 'Related Occurrence',
        name: 'Occurrence',
        required: true,
        visible: false,
      });
    }
    if (property.bodyKey) {
      serializer.addProperty('file', {
        category:
          property.value === 'occurrencetypes'
            ? 'Related Occurrence'
            : 'Document Properties',
        type: CustomPropertyGridComponentTypes.csDocsPropertiesDropdown,
        name: property.value,
        displayName: property.text,
        default: property.value,
        required: true,
        visibleIndex: property.value === 'occurrencetypes' ? 0 : index,
      });
      index = index + 1;
      serializer.addProperty('file', {
        category:
          property.value === 'occurrencetypes'
            ? 'Related Occurrence'
            : 'Document Properties',
        type: 'expression',
        name: `valueExpression${property.bodyKey}`,
        displayName: 'Value expression for ' + property.text,
        visibleIndex: property.value === 'occurrencetypes' ? 1 : index,
      });
      serializer.addProperty('file', {
        category: 'Document Properties',
        name: property.bodyKey,
        visible: false,
        required: true,
      });
    }
  });

  serializer.addProperty('file', {
    category: 'Document Properties',
    name: `querySort`,
    visible: true,
    default: 'ASC',
    choices: ['ASC', 'DESC'],
    visibleIndex: 0,
    required: true,
  });

  //  CS Documentation Properties dropdown
  registerCustomPropertyEditor(
    CustomPropertyGridComponentTypes.csDocsPropertiesDropdown
  );
};
