import { gql } from 'apollo-angular';

// === GET PAGE BY ID ===

/** Graphql query for getting a page data by its id */
export const GET_PAGE_BY_ID = gql`
  query GetPageById($id: ID!) {
    page(id: $id) {
      id
      context
    }
  }
`;
