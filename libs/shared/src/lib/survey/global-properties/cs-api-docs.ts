import { InMemoryCache } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { JsonMetadata, Serializer } from 'survey-core';
import { registerCustomPropertyEditor } from '../components/utils/component-register';
import { CustomPropertyGridComponentTypes } from '../components/utils/components.enum';

/**
 * Available properties from the CS API Documentation
 */
const availableProperties = [
  { text: 'Aetiology', value: 'aetiologys' },
  {
    text: 'Confidentiality',
    value: 'informationconfidentialitys',
  },
  { text: 'Country', value: 'countrys' },
  { text: 'Disease Condition', value: 'diseaseconds' },
  { text: 'Document Category', value: 'documentcategorys' },
  { text: 'Document Type', value: 'documenttypes' },
  { text: 'Hazard', value: 'hazards' },
  { text: 'IHR Communication', value: 'ihrcommunications' },
  { text: 'IMS Function', value: 'assignmentfunctions' },
  { text: 'IMS Role', value: 'documentroles' },
  { text: 'Language', value: 'languages' },
  { text: 'Occurrence', value: 'occurrences' },
  { text: 'Occurrence Type', value: 'occurrencetypes' },
  { text: 'Region', value: 'regions' },
  { text: 'Source of information - type', value: 'sourceofinformations' },
  { text: 'Syndrome', value: 'syndromes' },
];

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
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCIsImtpZCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCJ9.eyJhdWQiOiJhcGk6Ly83NWRlY2EwNi1hZTA3LTQ3NjUtODVjMC0yM2U3MTkwNjI4MzMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mNjEwYzBiNy1iZDI0LTRiMzktODEwYi0zZGMyODBhZmI1OTAvIiwiaWF0IjoxNzI5MTcxODUwLCJuYmYiOjE3MjkxNzE4NTAsImV4cCI6MTcyOTE3NjIzNSwiYWNyIjoiMSIsImFpbyI6IkFXUUFtLzhZQUFBQUlLbU1pTWRoaUxRc0Y4VnhISHVXUkJEWVd2eFh0V25EQ0k1MGNsVzFiQ2xhV1QzU2p0K096WXpPWjhlTHI4QUFsU3l1WEs3bER0Sk5xWm5BTEV0WS9MTUxOOU80SlpQN3Ftcm10RUZCZ1lmd3d6cWFRUmtXVnQ2RjBuWmhZeEhrIiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjAyMTIwMmFjLWQyM2ItNDc1Ny04M2UzLWY2ZWNkZTEyMjY2YiIsImFwcGlkYWNyIjoiMCIsImVtYWlsIjoidW5haUByZWxpZWZhcHBsaWNhdGlvbnMub3JnIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZmJhY2Q0OGQtY2NmNC00ODBkLWJhZjAtMzEwNDgzNjgwNTVmLyIsImlwYWRkciI6IjIxMy45NC41MC4xNTMiLCJuYW1lIjoiVW5haSIsIm9pZCI6Ijg0MWIxYzEyLTgyNTktNGJmNS1hOWQ2LWZhY2MyZDMyZDUzZCIsInJoIjoiMC5BVWNBdDhBUTlpUzlPVXVCQ3ozQ2dLLTFrQWJLM25VSHJtVkhoY0FqNXhrR0tETkhBRkEuIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzaWQiOiIxNDEyZjVlZi03OTBkLTQ5M2EtODc0My0xY2JiNDY2NTQ4MDAiLCJzdWIiOiJLQkVKYy1WTzFTLXd1dDluaXpYdjltcFFIVDVaWG5odEpTOHBLQmNOTXVVIiwidGlkIjoiZjYxMGMwYjctYmQyNC00YjM5LTgxMGItM2RjMjgwYWZiNTkwIiwidW5pcXVlX25hbWUiOiJ1bmFpQHJlbGllZmFwcGxpY2F0aW9ucy5vcmciLCJ1dGkiOiJaSTNvbEVWbUdreTZnTEVtTU1NNUFBIiwidmVyIjoiMS4wIn0.Js40g4Bh5RBcZzpXjPxXkvfyyr6Xn5zVO9kiuvqPWhoCtqex9pZtknehngn1ScKMiwBXKqEoGNfXGMvdBBH7I_c_YFkITrFkE6aVEePsGupZz17lcKO_CwB2yGjO952PTEg3wS6kDdOnanP22FhF5AtsA45j2c2BzDzN_HRqPmk_bcZ3tOzoXT8yhZU2KMrTWFpxceZEuwLSATpPkpXp1rHX0Ud9tIYkiYVrdhXarfPBrAjcFCNfXotSElP-C7k3hmX4drBFQproOdn7M1YQka6pVATK-v2fh29uoyQoCFp1WYWQv9ZHMuG2PSSvDMvkzWPrp_3KzXlVhNnyo1oS3A';
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

  availableProperties.forEach((property, index) => {
    serializer.addProperty('file', {
      category: 'CS Document API',
      type: CustomPropertyGridComponentTypes.csDocsPropertiesDropdown,
      name: property.value,
      displayName: property.text,
      default: property.value,
      required: true,
      visibleIndex: index,
    });

    serializer.addProperty('file', {
      category: 'CS Document API',
      name: `selected${property.value}PropertyItems`,
      visible: false,
      required: true,
    });
  });

  //  CS Documentation Properties dropdown
  registerCustomPropertyEditor(
    CustomPropertyGridComponentTypes.csDocsPropertiesDropdown
  );
};
