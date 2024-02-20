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
  console.log(variables);
  const graphQLQuery = gql(query);
  const definition = graphQLQuery.definitions?.[0];
  if (definition?.kind !== 'OperationDefinition') {
    console.log('ici');
    return variables;
  }
  (definition.variableDefinitions ?? []).forEach((definition) => {
    console.log(definition);
    if (
      get(definition, 'type.name.value') === 'JSON' &&
      get(variables, definition.variable.name.value)
    ) {
      console.log(
        JSON.stringify(get(variables, definition.variable.name.value))
      );
      set(
        variables,
        definition.variable.name.value,
        JSON.stringify(get(variables, definition.variable.name.value))
      );
      console.log(variables);
    }
  });
};

export default transformGraphQLVariables;
