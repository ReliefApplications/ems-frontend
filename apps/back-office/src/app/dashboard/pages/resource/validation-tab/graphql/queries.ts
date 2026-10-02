import { gql } from 'apollo-angular';

/** Graphql query for getting the uniqueness rules of a resource */
export const GET_RESOURCE_UNIQUENESS_RULES = gql`
  query GetResourceUniquenessRules($id: ID!) {
    resource(id: $id) {
      id
      fields
      uniquenessRules {
        id
        name
        fields
        severity
        message
        messageTranslations
        active
        condition
        dateIntersection {
          startField
          endField
          allowAdjacent
        }
      }
      metadata {
        name
        automated
        type
        editor
        filter
        multiSelect
        filterable
        options
      }
      canUpdate
    }
  }
`;
