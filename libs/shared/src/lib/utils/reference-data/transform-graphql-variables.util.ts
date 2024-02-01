import get from 'lodash/get';
import set from 'lodash/set';
import { gql } from '@apollo/client';

/**
 * Transform reference data graphql variables, to make sure they have the correct format.
 *
 * @param query graphql query to send
 * @param variables variables mapping
 * @returns void
 */
export const transformGraphQLVariables = (
  query: string,
  variables: any = {}
) => {
  const graphQLQuery = gql(query);
  const definition = graphQLQuery.definitions?.[0];
  if (definition?.kind !== 'OperationDefinition') {
    return variables;
  }
  (definition.variableDefinitions ?? []).forEach((def) => {
    if (
      get(def, 'type.name.value') === 'JSON' &&
      get(variables, def.variable.name.value)
    ) {
      let value = get(variables, def.variable.name.value);
      if (value && typeof value === 'object') {
        // eslint-disable-next-line no-prototype-builtins
        if (value.hasOwnProperty('AND') && value.AND !== null) {
          value = { AND: Object.values(value.AND) };
          // eslint-disable-next-line no-prototype-builtins
        } else if (value.hasOwnProperty('OR') && value.OR !== null) {
          value = { OR: Object.values(value.OR) };
        }
      }
      set(variables, def.variable.name.value, JSON.stringify(value, null, 2));
    }
  });
};

export default transformGraphQLVariables;
