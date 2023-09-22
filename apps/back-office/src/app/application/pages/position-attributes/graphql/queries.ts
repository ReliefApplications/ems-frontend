import { gql } from 'apollo-angular';

// === GET POSITION ATTRIBUTES FORM CATEGORY ===

/** Graphql query for getting the position attributes from their category */
export const GET_POSITION_ATTRIBUTES_FROM_CATEGORY = gql`
  query GetPositionAttributesFromCategory($id: ID!) {
    positionAttributes(category: $id) {
      value
      category {
        title
      }
      usersCount
    }
  }
`;
