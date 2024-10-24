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
  // const token = localStorage.getItem('access_token');
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCIsImtpZCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCJ9.eyJhdWQiOiJhcGk6Ly83NWRlY2EwNi1hZTA3LTQ3NjUtODVjMC0yM2U3MTkwNjI4MzMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mNjEwYzBiNy1iZDI0LTRiMzktODEwYi0zZGMyODBhZmI1OTAvIiwiaWF0IjoxNzI5NzcwMDQwLCJuYmYiOjE3Mjk3NzAwNDAsImV4cCI6MTcyOTc3NDkzMSwiYWNyIjoiMSIsImFpbyI6IkFXUUFtLzhZQUFBQXVEWXZKWWREd0ZZWVJ2aUlHZXRYbnYwYWRjQmtDOWNjSXVhQ2ovRndpOVBXZ2VWSy9ueXJUZDRzalpvSnFRWTA2eXl3M1hreW5peXgvYW01TTVFM2s1NlRySFRhb0dIZTRsT1VJNUNWek5tRU4xOWlobXc4WTlGbWJ2Y1pSOW9GIiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjAyMTIwMmFjLWQyM2ItNDc1Ny04M2UzLWY2ZWNkZTEyMjY2YiIsImFwcGlkYWNyIjoiMCIsImVtYWlsIjoidW5haUByZWxpZWZhcHBsaWNhdGlvbnMub3JnIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZmJhY2Q0OGQtY2NmNC00ODBkLWJhZjAtMzEwNDgzNjgwNTVmLyIsImlwYWRkciI6IjIxMy45NC41MC4xNTMiLCJuYW1lIjoiVW5haSIsIm9pZCI6Ijg0MWIxYzEyLTgyNTktNGJmNS1hOWQ2LWZhY2MyZDMyZDUzZCIsInJoIjoiMC5BVWNBdDhBUTlpUzlPVXVCQ3ozQ2dLLTFrQWJLM25VSHJtVkhoY0FqNXhrR0tETkhBRkEuIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzaWQiOiIxNDEyZjVlZi03OTBkLTQ5M2EtODc0My0xY2JiNDY2NTQ4MDAiLCJzdWIiOiJLQkVKYy1WTzFTLXd1dDluaXpYdjltcFFIVDVaWG5odEpTOHBLQmNOTXVVIiwidGlkIjoiZjYxMGMwYjctYmQyNC00YjM5LTgxMGItM2RjMjgwYWZiNTkwIiwidW5pcXVlX25hbWUiOiJ1bmFpQHJlbGllZmFwcGxpY2F0aW9ucy5vcmciLCJ1dGkiOiJPellFeTc5aXBVMk1VRnMyeldLSUFBIiwidmVyIjoiMS4wIn0.XdLuwR06bdyyTVCLkHFs3iqS6xnR51t8g2P2tChiUeOHSWh-cKpwR8RXLv6FTWvKR4COekXw6ZfLYDCROt4ijHEMJkBZuRqCOKBKNCMyTDshHAe8k00s5H08yxcowDm13DCWBhlJ3nuU_0wbVZzWnnQbsXTRfzUNHU50rTfoI30P7QIk0uKsHcqPXLxlVvKbryTz6P-r4S8_FWC5OWLWigxrNQfairW5SLDaVj_VACfxjGMAsY4NPXn269xJwA5P4UghjCDCWuSclxL5L7_EKT3Q58wEHnYyUzPYwpypfRvnym93FMjc_XGAQzFWQBVN8RL_RW0_b6EuMIavYh5aMA';
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
        name: `valueExpression${property.value}`,
        displayName: 'Default value expression for ' + property.text,
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
