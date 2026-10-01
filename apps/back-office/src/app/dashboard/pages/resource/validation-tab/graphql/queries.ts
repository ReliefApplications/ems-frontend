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
        active
        showMatches
        condition {
          field
          operator
          value
        }
        dateIntersection {
          startField
          endField
          allowAdjacent
        }
      }
      canUpdate
    }
  }
`;
