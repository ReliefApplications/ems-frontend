import { get } from 'lodash';
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
  (definition.variableDefinitions ?? []).forEach((definition) => {
    if (
      get(definition, 'type.name.value') === 'JSON' &&
      get(variables, definition.variable.name.value)
    ) {
      set(
        variables,
        definition.variable.name.value,
        JSON.stringify(get(variables, definition.variable.name.value))
      );
    }
  });
};

export default transformGraphQLVariables;
